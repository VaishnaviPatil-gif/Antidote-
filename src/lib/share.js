/**
 * Antidote+ — Android-safe copy & share helpers.
 *
 * The clinician handover card offers only Copy and Share (no PDF/print — those
 * need a bundled engine that is unreliable inside an Android WebView). These
 * helpers use ONLY web-standard APIs and degrade gracefully so the app never
 * depends on a capability that may be absent in an older System WebView:
 *
 *   - Copy  : Clipboard API when available in a secure context, else a hidden
 *             <textarea> + execCommand("copy") fallback.
 *   - Share : Web Share API when present (opens the native Android sheet), else
 *             it falls back to copying the text so the action never dead-ends.
 *
 * No Capacitor plugin is imported, so nothing here can break `npm run build`
 * or `npx cap sync` if a plugin isn't installed.
 */

/**
 * Copy text to the clipboard. Returns true on success.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  // Preferred path — async Clipboard API (needs a secure context; Capacitor
  // serves the app from a secure origin, so this works in the Android WebView).
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  // Legacy fallback for older WebViews / non-secure contexts.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Share text via the native share sheet when supported, otherwise copy it.
 * @param {{ title?: string, text: string }} payload
 * @returns {Promise<"shared"|"copied"|"cancelled"|"failed">}
 */
export async function shareOrCopy({ title, text }) {
  if (!text) return "failed";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (err) {
      // The user dismissing the sheet is a normal outcome, not an error.
      if (err && err.name === "AbortError") return "cancelled";
      /* otherwise fall through to copy so the action still does something */
    }
  }

  const ok = await copyToClipboard(text);
  return ok ? "copied" : "failed";
}

/**
 * Normalise a phone number for a `tel:`/`sms:` URI: keep a leading "+" and
 * digits only (strips spaces, dashes, parentheses that break some dialers).
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  if (!phone) return "";
  const trimmed = String(phone).trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/[^\d]/g, "");
}

/**
 * Place a real phone call by opening a `tel:` URI. Works in the Android WebView
 * (Capacitor) and on mobile browsers; on desktop it is a no-op-safe navigation.
 * @param {string} phone
 * @returns {boolean} whether a dialable number was found
 */
export function startCall(phone) {
  const num = normalizePhone(phone);
  if (!num) return false;
  window.location.href = `tel:${num}`;
  return true;
}

/**
 * Open the device SMS composer prefilled with `body`, addressed to `phone`.
 * Uses the widely-supported `sms:<number>?body=` form (Android/modern browsers).
 * Returns false when there is nothing to compose so the caller can fall back.
 * @param {string} phone
 * @param {string} body
 * @returns {boolean}
 */
export function openSms(phone, body) {
  const num = normalizePhone(phone);
  const text = body ? encodeURIComponent(body) : "";
  if (!num && !text) return false;
  // "sms:<num>?body=" is understood by Android's default messaging app and by
  // iOS/most mobile browsers; an empty number still opens the composer.
  window.location.href = `sms:${num}${text ? `?body=${text}` : ""}`;
  return true;
}
