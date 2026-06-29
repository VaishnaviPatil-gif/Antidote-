import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

/**
 * EmergencyContext — the single source of truth that connects every screen,
 * including the existing routing screen (which READS `victimLocation` and
 * `severity`). This is the §3 shared-state contract:
 *
 *   {
 *     language, biteTime, victimLocation, snake, severity,
 *     symptomLog, emergencyContact, ...
 *   }
 *
 * No Redux / Zustand — one lightweight Context as specified. State is mirrored
 * to localStorage so the offline flow (§2.9) survives reloads / lost signal.
 */

const EmergencyContext = createContext(null);

const STORAGE_KEY = "antidote.emergency.v1";

/** Default shape — matches the §3 contract exactly. */
const DEFAULT_STATE = {
  language: "te", // te | hi | en — default Telugu
  biteTime: null, // Date (ISO in storage) | null
  victimLocation: null, // { lat, lng } | null  — routing READS this
  victimLabel: null, // human-readable place name, when known
  snake: null, // { species, confidence, venomous } | null
  severity: "mild", // mild | moderate | severe — routing READS this
  symptomLog: [], // Array<{ t, answers, level }>
  emergencyContact: null, // { name, phone } | null
  recommendedHospital: null, // set by routing so SOS / hospital view can read it
};

/**
 * Rehydrate persisted state, converting stored ISO strings back into Dates.
 * Falls back to DEFAULT_STATE on any parse error (corrupt / absent storage).
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      biteTime: parsed.biteTime ? new Date(parsed.biteTime) : null,
      symptomLog: Array.isArray(parsed.symptomLog)
        ? parsed.symptomLog.map((e) => ({ ...e, t: new Date(e.t) }))
        : [],
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Provider. Wrap the whole app in this once (in App.jsx).
 * Exposes the state plus narrow, intention-revealing setters so each screen
 * touches only its own slice of the contract.
 */
export function EmergencyProvider({ children }) {
  const [state, setState] = useState(loadState);

  // Persist on every change (Dates serialise to ISO via JSON automatically).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — non-fatal, app keeps working in memory */
    }
  }, [state]);

  const patch = useCallback(
    (next) => setState((s) => ({ ...s, ...next })),
    []
  );

  // ── Slice setters (one per writer screen, per §3) ───────────────────────
  const setLanguage = useCallback((language) => patch({ language }), [patch]);

  /** Home writes biteTime + victimLocation when the victim taps "I've been bitten". */
  const startEmergency = useCallback(
    (location, label) =>
      setState((s) => ({
        ...s,
        biteTime: s.biteTime ?? new Date(), // never reset an existing bite time
        victimLocation: location ?? s.victimLocation,
        victimLabel: label ?? s.victimLabel,
      })),
    []
  );

  const setVictimLocation = useCallback(
    (victimLocation, victimLabel = null) =>
      patch({ victimLocation, victimLabel }),
    [patch]
  );

  /** Snake capture writes the `snake` slice. */
  const setSnake = useCallback((snake) => patch({ snake }), [patch]);

  /** Severity tracker writes `severity` and appends to `symptomLog`. */
  const setSeverity = useCallback((severity) => patch({ severity }), [patch]);

  const appendSymptom = useCallback(
    (entry) =>
      setState((s) => ({
        ...s,
        symptomLog: [...s.symptomLog, entry],
        severity: entry.level ?? s.severity, // keep severity in lockstep
      })),
    []
  );

  const setEmergencyContact = useCallback(
    (emergencyContact) => patch({ emergencyContact }),
    [patch]
  );

  /** Routing writes the chosen hospital so SOS + the hospital view can read it. */
  const setRecommendedHospital = useCallback(
    (recommendedHospital) => patch({ recommendedHospital }),
    [patch]
  );

  /**
   * Clear the whole emergency and return to a clean slate — for a new victim or
   * a repeat demo. Wipes biteTime, symptomLog, severity, location, snake, etc.
   * and the persisted copy, but KEEPS the chosen language (a UI preference, not
   * part of the emergency). Without this the first bite's stale state would leak
   * into the next use, since everything is mirrored to localStorage.
   */
  const resetEmergency = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — in-memory reset below still applies */
    }
    setState((s) => ({ ...DEFAULT_STATE, language: s.language }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setLanguage,
      startEmergency,
      setVictimLocation,
      setSnake,
      setSeverity,
      appendSymptom,
      setEmergencyContact,
      setRecommendedHospital,
      resetEmergency,
    }),
    [
      state,
      setLanguage,
      startEmergency,
      setVictimLocation,
      setSnake,
      setSeverity,
      appendSymptom,
      setEmergencyContact,
      setRecommendedHospital,
      resetEmergency,
    ]
  );

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

/**
 * Hook for consuming the emergency state.
 * @returns the §3 contract plus its setters.
 * @throws if used outside <EmergencyProvider>.
 */
export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) {
    throw new Error("useEmergency must be used within <EmergencyProvider>");
  }
  return ctx;
}

/**
 * Minutes elapsed since the bite, live. Returns null if no bite recorded.
 * Clinicians triage heavily on this number — every screen reads it from here
 * so the value is identical in the tracker, SOS message and hospital view.
 * @param {Date|null} biteTime
 * @param {Date} [now]
 * @returns {number|null}
 */
export function minutesSinceBite(biteTime, now = new Date()) {
  if (!biteTime) return null;
  return Math.max(0, Math.floor((now.getTime() - new Date(biteTime).getTime()) / 60000));
}
