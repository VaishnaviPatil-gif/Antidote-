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
