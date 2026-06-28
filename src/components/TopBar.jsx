import React from "react";
import { Siren } from "lucide-react";
import { C } from "../theme.js";
import { LANGS, LANG_LABEL, tFor } from "../i18n.js";
import { useEmergency } from "../context/EmergencyContext.jsx";

/**
 * Shared top bar — visually identical to the routing screen's header:
 * teal background, Siren badge, "Antidote+" wordmark + trilingual tagline,
 * and the తె/हि/EN language pill that drives the global language in context.
 *
 * Rendered once by <Shell> so every non-routing screen shares it. The routing
 * hero keeps its own matching header (it is self-contained per §4).
 */
export default function TopBar() {
  const { language, setLanguage } = useEmergency();
  const t = tFor(language);

  return (
    <header
      style={{ background: C.teal }}
      className="px-4 pt-4 pb-3 text-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,.14)", width: 36, height: 36 }}
          >
            <Siren size={20} strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg tracking-tight">Antidote+</div>
            <div style={{ color: "#BFE3E1" }} className="text-xs">
              {t.tag}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1 rounded-full p-0.5"
          style={{ background: "rgba(255,255,255,.12)" }}
          role="group"
          aria-label="Language"
        >
          {LANGS.map((l) => {
            const active = language === l;
            return (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                aria-label={`Switch language to ${l === "te" ? "Telugu" : l === "hi" ? "Hindi" : "English"}`}
                aria-pressed={active}
                className="rounded-full text-xs font-semibold transition-colors"
                style={{
                  minWidth: 34,
                  height: 30,
                  padding: "0 8px",
                  background: active ? "#fff" : "transparent",
                  color: active ? C.teal : "#DCEFEE",
                }}
              >
                {LANG_LABEL[l]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
