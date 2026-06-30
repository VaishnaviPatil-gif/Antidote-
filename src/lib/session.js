/**
 * Antidote+ — emergency session persistence (Priority 1).
 *
 * A thin domain layer over the IndexedDB wrapper (./db.js) that gives the app a
 * first-class, resumable **session**: the full EmergencyContext state plus
 * metadata (id, start/last-saved timestamps, status). This is the durable copy
 * that survives an app restart — even on mobile WebViews that evict
 * localStorage — so the victim can pick the emergency back up where they left.
 *
 * Contract:
 *   - `state` is the plain EmergencyContext data (no setters), exactly as the
 *     provider holds it. IndexedDB clones it natively, so Dates round-trip.
 *   - `meta` is owned here and preserved across saves: a save keeps the original
 *     `id` / `startedAt` and only advances `updatedAt` + recomputes `status`.
 *
 * Like every persistence path in this app, all calls are graceful: failures
 * resolve to a safe value and never throw into React.
 */

import { idbGet, idbSet, idbDel } from "./db.js";

/** Single, stable key — one active emergency session at a time. */
const SESSION_KEY = "emergency-session";

/**
 * In-memory cache of the current session metadata, so repeated debounced saves
 * preserve the same id / startedAt without an extra read each time. Seeded from
 * IndexedDB on the first `loadSession()`, or created on the first save.
 */
let metaCache = null;

/** Generate a stable-ish session id (timestamp + short random suffix). */
function makeId(now) {
  return `s-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * A session is "active" once a bite is recorded — that's the moment there is a
 * real emergency worth resuming. Before that it's just an idle app open.
 */
function statusFor(state) {
  return state && state.biteTime ? "active" : "idle";
}

/** Build / advance the metadata for a save. */
function nextMeta(state, now) {
  if (!metaCache) {
    metaCache = {
      id: makeId(now),
      startedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: statusFor(state),
    };
  } else {
    metaCache = {
      ...metaCache,
      updatedAt: now.toISOString(),
      status: statusFor(state),
    };
  }
  return metaCache;
}

/**
 * Persist the current emergency state. Returns the metadata that was written
 * (so the caller can surface `updatedAt` as a "saved" indicator), or null if
 * the write could not be committed.
 *
 * @param {object} state  the EmergencyContext data slice (no functions)
 * @returns {Promise<{id:string,startedAt:string,updatedAt:string,status:string}|null>}
 */
export async function saveSession(state) {
  const meta = nextMeta(state, new Date());
  const ok = await idbSet(SESSION_KEY, { state, meta });
  return ok ? meta : null;
}

/**
 * Load the durable session, if any. Also re-seeds the metadata cache so the
 * next save preserves this session's id / startedAt.
 *
 * @returns {Promise<{state:object, meta:object}|null>}
 */
export async function loadSession() {
  const saved = await idbGet(SESSION_KEY);
  if (saved && saved.state && saved.meta) {
    metaCache = saved.meta;
    return saved;
  }
  return null;
}

/**
 * Clear the durable session and reset the metadata cache — called when the user
 * starts over, so the next emergency gets a fresh session id.
 * @returns {Promise<boolean>}
 */
export async function clearSession() {
  metaCache = null;
  return idbDel(SESSION_KEY);
}
