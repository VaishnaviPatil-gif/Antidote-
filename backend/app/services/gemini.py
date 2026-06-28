"""Gemini integration — the proxy's only external dependency.

Design rules:
  * Never raise to the caller. Every path returns a usable, SAFE value.
  * Identification falls back to "assume venomous" on any failure or low
    confidence. We never expose raw provider errors.
  * Summarisation falls back to a deterministic local sentence (mirroring the
    frontend composer) so the feature works even with no key / no network.
"""

from __future__ import annotations

import base64
import json
import logging
from datetime import datetime, timezone

from ..config import settings

logger = logging.getLogger("antidote.gemini")

# The safe default, identical to the frontend's contract.
SAFE_DEFAULT = {"species": "Unidentified", "confidence": 0.0, "venomous": True}

_IDENTIFY_PROMPT = (
    "You are a careful assistant supporting snakebite first response in rural "
    "India. Look at the image and decide whether it shows a snake and, if so, "
    "the most likely species — focusing on the medically important 'Big Four' "
    "(spectacled cobra, common krait, Russell's viper, saw-scaled viper) and "
    "also king cobra and hump-nosed pit viper. "
    'Respond with ONLY minified JSON: {"species": string, "confidence": number '
    "between 0 and 1, \"venomous\": boolean}. If you are not clearly sure, use a "
    "low confidence and set venomous=true. No text outside the JSON."
)

_SUMMARIZE_PROMPT = (
    "You are assisting a clinician who is about to receive a snakebite patient. "
    "From the monitoring log below, write ONE concise English handover sentence "
    "(max ~40 words) covering: minutes since the bite, swelling spread, "
    "neurotoxic signs (ptosis, blurred/double vision, slurred speech, "
    "drowsiness), haematotoxic signs (bleeding), breathing difficulty, the "
    "current severity and its trend. Do NOT give a definitive diagnosis — this "
    "supports clinical assessment. Return only the sentence.\n\n"
)


def _genai():
    """Return a configured google.generativeai module, or None if unavailable.

    None means: SDK missing OR no API key. Callers then use safe fallbacks.
    """
    if not settings.gemini_enabled:
        return None
    try:
        import google.generativeai as genai
    except ImportError:
        logger.warning("google-generativeai not installed; using fallbacks")
        return None
    genai.configure(api_key=settings.gemini_api_key)
    return genai


def _extract_json(text: str) -> dict:
    """Pull the first JSON object out of a model response (tolerates fences)."""
    if not text:
        return {}
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return {}
    try:
        return json.loads(text[start : end + 1])
    except (ValueError, TypeError):
        return {}


def identify(image_b64: str, mime: str = "image/jpeg") -> dict:
    """Identify a snake from a base64 image. Always returns a safe dict."""
    genai = _genai()
    if genai is None:
        logger.info("identify: no Gemini; returning safe default")
        return dict(SAFE_DEFAULT)
    try:
        data = base64.b64decode(image_b64, validate=False)
        model = genai.GenerativeModel(settings.gemini_model)
        resp = model.generate_content(
            [_IDENTIFY_PROMPT, {"mime_type": mime, "data": data}]
        )
        parsed = _extract_json(getattr(resp, "text", "") or "")
        species = str(parsed.get("species") or "Unidentified").strip()
        confidence = float(parsed.get("confidence") or 0.0)
        venomous = bool(parsed.get("venomous", True))

        # Refuse to name a species below the confidence floor → assume venomous.
        if confidence < settings.low_confidence or species.lower() in (
            "",
            "unidentified",
            "unknown",
            "none",
        ):
            logger.info("identify: low confidence (%.2f); safe default", confidence)
            return dict(SAFE_DEFAULT)

        return {
            "species": species,
            "confidence": max(0.0, min(1.0, confidence)),
            "venomous": venomous,
        }
    except Exception:  # noqa: BLE001 — never leak provider errors to the client
        logger.exception("identify failed; returning safe default")
        return dict(SAFE_DEFAULT)


def _parse_iso(value: str | None) -> datetime | None:
    """Parse an ISO timestamp (tolerating a trailing 'Z')."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


def _compose_fallback(symptom_log: list, bite_time: str | None) -> str:
    """Deterministic clinician sentence — mirrors the frontend composer.

    Used whenever Gemini is unavailable so /api/summarize is always useful.
    """
    if not symptom_log:
        return "No monitoring data recorded yet."

    last = symptom_log[-1]
    answers = last.get("answers", {}) if isinstance(last, dict) else {}
    level = (last.get("level") if isinstance(last, dict) else None) or "mild"

    bt = _parse_iso(bite_time)
    mins = None
    if bt is not None:
        now = datetime.now(timezone.utc)
        if bt.tzinfo is None:
            bt = bt.replace(tzinfo=timezone.utc)
        mins = max(0, int((now - bt).total_seconds() // 60))

    swell = {
        "none": "no spreading swelling",
        "local": "local swelling only",
        "spreading": "swelling spreading up the limb",
    }.get(answers.get("swelling"), "swelling not noted")

    signs = []
    if answers.get("breathing") == "yes":
        signs.append("breathing difficulty")
    if answers.get("vision") == "yes":
        signs.append("ptosis / blurred or double vision")
    if answers.get("bleeding") == "yes":
        signs.append("bleeding from gums, urine or bite site")
    if answers.get("drowsy") == "yes":
        signs.append("drowsiness or slurred speech")

    neuro = answers.get("vision") == "yes" or answers.get("drowsy") == "yes"
    hemato = answers.get("bleeding") == "yes"
    if neuro and hemato:
        impression = "possible neuro- and haematotoxic envenomation"
    elif neuro:
        impression = "possible neurotoxic envenomation"
    elif hemato:
        impression = "possible haematotoxic envenomation"
    elif level == "mild":
        impression = "local effects only so far"
    else:
        impression = "systemic features developing"

    mins_str = f"{mins}-min-old bite" if mins is not None else "bite (time unknown)"
    sign_str = f"; {', '.join(signs)}" if signs else ""
    return (
        f"{mins_str}; {swell}{sign_str}. Impression: {impression}, severity "
        f"{level}. Prepare for snakebite envenomation; share with receiving hospital."
    )


def summarize(symptom_log: list, bite_time: str | None, language: str = "en") -> dict:
    """Summarise the monitoring log. Always returns {summary, source}."""
    fallback = _compose_fallback(symptom_log, bite_time)
    genai = _genai()
    if genai is None:
        return {"summary": fallback, "source": "fallback"}
    try:
        model = genai.GenerativeModel(settings.gemini_model)
        context = {"biteTime": bite_time, "symptomLog": symptom_log}
        resp = model.generate_content(_SUMMARIZE_PROMPT + json.dumps(context))
        text = (getattr(resp, "text", "") or "").strip()
        if not text:
            return {"summary": fallback, "source": "fallback"}
        return {"summary": text, "source": "gemini"}
    except Exception:  # noqa: BLE001
        logger.exception("summarize failed; returning fallback")
        return {"summary": fallback, "source": "fallback"}
