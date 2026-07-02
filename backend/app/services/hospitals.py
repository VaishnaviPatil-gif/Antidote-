"""Hospital antivenom-stock registry — the live inventory behind the routing.

Antidote+'s differentiator is routing a victim to the nearest facility that
ACTUALLY HAS anti-snake-venom (ASV) in stock. That only means something if the
stock number is *live* rather than hardcoded in the client. This module is the
authoritative store:

  - Seeded with the Vikarabad-district facilities the app ships with.
  - Held in memory and mirrored to a JSON file so an ASHA worker's stock update
    (POST /api/hospitals/{id}/stock) survives a server restart.
  - No external database — a single JSON file keeps the demo self-contained and
    the deployment trivial, while still being a real fetched-with-timestamp feed.

Every record carries an ISO `updated_at` so the client can render "stock updated
N min ago" from real wall-clock time and flag stale inventory for reconfirmation.
"""

from __future__ import annotations

import json
import logging
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path

logger = logging.getLogger("antidote.hospitals")

# Persist next to the app package so it is writable in dev and in a container.
_STORE_PATH = Path(__file__).resolve().parent.parent / "data" / "hospitals_store.json"

_lock = threading.Lock()
_store: dict[str, dict] | None = None


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _ago(minutes: int) -> str:
    """ISO timestamp `minutes` in the past — used to seed realistic update ages."""
    return (_now() - timedelta(minutes=minutes)).isoformat()


# ── Seed inventory ──────────────────────────────────────────────────────────
# Mirrors src/lib/hospitals.js SEED_FACILITIES so the client's offline fallback
# and this live feed agree. Coordinates are real; `vials` is the seeded stock.
def _seed() -> dict[str, dict]:
    rows = [
        # id,            name,                              tier,       lat,     lng,     vials, icu,   sector,   beds, updated_min
        ("phc-marpally",  "PHC Marpally",                    "phc",      17.262, 77.785,  0,   False, "govt",    0,   185),
        ("phc-doulta",    "PHC Doultabad",                   "phc",      17.305, 77.730,  2,   False, "govt",    1,   540),
        ("chc-tandur",    "CHC Tandur",                      "chc",      17.245, 77.575,  8,   False, "govt",    4,   41),
        ("ah-vikarabad",  "Area Hospital Vikarabad",         "ah",       17.337, 77.905,  24,  False, "govt",    8,   12),
        ("dh-vikarabad",  "District Hospital Vikarabad",     "dh",       17.331, 77.901,  30,  True,  "govt",    15,  25),
        ("chc-parigi",    "CHC Parigi",                      "chc",      17.130, 77.870,  0,   False, "govt",    3,   95),
        ("gandhi",        "Gandhi Hospital, Secunderabad",   "tertiary", 17.443, 78.499,  120, True,  "govt",    40,  18),
        ("nims",          "NIMS, Hyderabad",                 "tertiary", 17.428, 78.448,  90,  True,  "govt",    35,  33),
        ("apollo-hyd",    "Apollo Hospital, Hyderabad",      "tertiary", 17.412, 78.432,  60,  True,  "private", 28,  22),
    ]
    return {
        r[0]: {
            "id": r[0],
            "name": r[1],
            "tier": r[2],
            "lat": r[3],
            "lng": r[4],
            "vials": r[5],
            "icu": r[6],
            "sector": r[7],
            "beds": r[8],
            "updated_at": _ago(r[9]),
        }
        for r in rows
    }


def _load() -> dict[str, dict]:
    """Load the store from disk, falling back to (and persisting) the seed."""
    global _store
    if _store is not None:
        return _store
    try:
        if _STORE_PATH.exists():
            data = json.loads(_STORE_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict) and data:
                _store = data
                return _store
    except Exception as exc:  # corrupt / unreadable file → reseed
        logger.warning("hospital store unreadable, reseeding: %s", exc)
    _store = _seed()
    _persist()
    return _store


def _persist() -> None:
    """Best-effort write of the in-memory store to disk (never raises)."""
    if _store is None:
        return
    try:
        _STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
        _STORE_PATH.write_text(json.dumps(_store, indent=2), encoding="utf-8")
    except Exception as exc:
        logger.warning("could not persist hospital store: %s", exc)


def list_hospitals() -> list[dict]:
    """All facilities with their current stock and last-updated timestamps."""
    with _lock:
        store = _load()
        return [dict(v) for v in store.values()]


def get_hospital(hospital_id: str) -> dict | None:
    with _lock:
        return dict(_load().get(hospital_id)) if hospital_id in _load() else None


def update_stock(hospital_id: str, vials: int, beds: int | None = None) -> dict | None:
    """Set a facility's ASV stock (and optionally beds), stamping `updated_at`.

    Returns the updated record, or None if the id is unknown. This is the ASHA
    worker / hospital-staff action that makes the inventory *live*.
    """
    with _lock:
        store = _load()
        rec = store.get(hospital_id)
        if rec is None:
            return None
        rec["vials"] = max(0, int(vials))
        if beds is not None:
            rec["beds"] = max(0, int(beds))
        rec["updated_at"] = _now().isoformat()
        _persist()
        return dict(rec)
