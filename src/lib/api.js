/**
 * Frontend API client for the thin FastAPI Gemini proxy.
 *
 * Both calls are GRACEFUL: on any failure (offline, backend down, bad shape)
 * they resolve to a safe value rather than throwing, so the UI keeps working
 * with on-device fallbacks. The Vite dev server proxies /api → :8000, and the
 * GEMINI_API_KEY never leaves the backend.
 */

/** Safe default identification, mirroring the backend contract exactly. */
const SAFE_DEFAULT = { species: "Unidentified", confidence: 0, venomous: true };

/**
 * POST /api/identify — analyse a snake photo.
 * Resolves to the safe default (assume venomous) on ANY failure, non-OK
 * response, or unexpected shape. `_failed` flags a transport/parse failure so
 * the UI can show a quiet note without changing the safety behaviour.
 *
 * @param {string} dataUrl - captured image as a data URL
 * @returns {Promise<{species:string,confidence:number,venomous:boolean,_failed:boolean}>}
 */
export async function identifySnake(dataUrl) {
  try {
    const base64 = String(dataUrl).split(",")[1] || "";
    const res = await fetch("/api/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });
    if (!res.ok) return { ...SAFE_DEFAULT, _failed: true };
    const data = await res.json();
    // Pipeline diagnostics (dev only): the exact JSON received from the proxy,
    // which is what the Snake screen renders verbatim (species + confidence).
    if (import.meta.env?.DEV) console.debug("[identify] /api/identify response:", data);
    const confidence = typeof data.confidence === "number" ? data.confidence : 0;
    const species =
      typeof data.species === "string" && data.species ? data.species : "Unidentified";
    const venomous = data.venomous === false ? false : true; // default venomous
    return { species, confidence, venomous, _failed: false };
  } catch {
    return { ...SAFE_DEFAULT, _failed: true };
  }
}

/**
 * POST /api/summarize — get a clinician handover sentence for the symptom log.
 * Resolves to null on any failure so the caller falls back to the local
 * composer (the tracker never depends on the backend to function).
 *
 * @param {Array} symptomLog
 * @param {Date|string|null} biteTime
 * @param {string} language
 * @returns {Promise<{text:string, source:string}|null>}
 */
export async function summarizeSymptoms(symptomLog, biteTime, language) {
  try {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptomLog, biteTime, language }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data.summary === "string" && data.summary) {
      return { text: data.summary, source: data.source || "gemini" };
    }
    return null;
  } catch {
    return null;
  }
}
