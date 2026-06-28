import React from "react";
import { WifiOff } from "lucide-react";
import { C } from "../theme.js";
import { tFor } from "../i18n.js";
import { useOnline } from "../hooks/useOnline.js";
import { useEmergency } from "../context/EmergencyContext.jsx";

/**
 * Persistent "you're offline — emergency features still work" banner (§2.9).
 *
 * Honest, not alarmist: it tells the user the core flow keeps running from
 * local state. It does NOT claim anything is live. Rendered in normal flow at
 * the top of the frame so it gently pushes content down (no overlap math), and
 * only mounts when the device actually reports offline.
 */
export default function OfflineBanner() {
  const online = useOnline();
  const { language } = useEmergency();
  const t = tFor(language);

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 px-4 py-2"
      style={{ background: C.amberPale, borderBottom: `1px solid ${C.amber}33` }}
    >
      <WifiOff size={16} style={{ color: C.amber }} className="shrink-0" />
      <span
        className="text-xs font-semibold leading-snug"
        style={{ color: C.amber }}
      >
        {t.offline.banner}
      </span>
    </div>
  );
}
