/**
 * Antidote+ — minimal promise-based IndexedDB wrapper.
 *
 * Zero dependencies, ~one object store. This is the durable persistence layer
 * for the offline emergency session (Priority 1). It deliberately mirrors the
 * existing philosophy in EmergencyContext / useOnline: **every operation is
 * graceful**. If IndexedDB is missing, blocked (private mode, locked-down
 * WebView) or errors mid-flight, reads resolve to `null` and writes resolve to
 * `false` — the app keeps working from localStorage + in-memory state exactly
 * as it does today. Nothing here can throw into the React tree.
 *
 * IndexedDB stores values via the structured-clone algorithm, so Dates, nested
 * objects and arrays round-trip natively — we do not hand-serialise. That keeps
 * `biteTime` and every `symptomLog[].t` as real Date objects on the way back,
 * matching the shape the rest of the app already expects.
 */

const DB_NAME = "antidote-plus";
const DB_VERSION = 1;
const STORE = "kv"; // single key/value store; keys are short stable strings

/** Lazily-opened singleton connection, cached as a promise. */
let dbPromise = null;

/** True when the runtime actually exposes IndexedDB. */
export function idbAvailable() {
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Open (and upgrade) the database once, caching the promise. Resolves to an
 * IDBDatabase, or `null` if IndexedDB is unavailable / refuses to open.
 */
function openDB() {
  if (!idbAvailable()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      resolve(null);
      return;
    }

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = () => {
      const db = req.result;
      // If another tab triggers a version change, close so it isn't blocked.
      db.onversionchange = () => {
        try {
          db.close();
        } catch {
          /* already closing — ignore */
        }
        dbPromise = null;
      };
      resolve(db);
    };

    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  }).catch(() => null);

  return dbPromise;
}

/** Run `fn(store)` inside a transaction, resolving with `fallback` on any error. */
function withStore(mode, fn, fallback) {
  return openDB().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) {
          resolve(fallback);
          return;
        }
        let tx;
        try {
          tx = db.transaction(STORE, mode);
        } catch {
          resolve(fallback);
          return;
        }
        const store = tx.objectStore(STORE);
        let result = fallback;
        try {
          fn(store, (value) => {
            result = value;
          });
        } catch {
          resolve(fallback);
          return;
        }
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => resolve(fallback);
        tx.onabort = () => resolve(fallback);
      })
  );
}

/**
 * Read a value by key.
 * @template T
 * @param {string} key
 * @returns {Promise<T|null>} the stored value, or null if absent / unavailable.
 */
export function idbGet(key) {
  return withStore(
    "readonly",
    (store, set) => {
      const req = store.get(key);
      req.onsuccess = () => set(req.result ?? null);
    },
    null
  );
}

/**
 * Write a value by key. Resolves to true on a committed write, false otherwise.
 * @param {string} key
 * @param {*} value  any structured-cloneable value (Dates included)
 * @returns {Promise<boolean>}
 */
export function idbSet(key, value) {
  return withStore(
    "readwrite",
    (store, set) => {
      store.put(value, key);
      set(true);
    },
    false
  );
}

/**
 * Delete a value by key. Resolves to true if the delete transaction committed.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export function idbDel(key) {
  return withStore(
    "readwrite",
    (store, set) => {
      store.delete(key);
      set(true);
    },
    false
  );
}
