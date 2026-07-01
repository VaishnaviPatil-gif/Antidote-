import React from "react";
import {
  AlertTriangle, MapPin, Building2, Navigation, PhoneCall, Stethoscope,
  FlaskConical, Ambulance, CheckCircle2, Check, Inbox, RadioTower,
} from "lucide-react";
import { C } from "../theme.js";

/**
 * EmergencyTimeline — the vertical emergency-coordination timeline (§SOS).
 *
 * Purely presentational: it receives the fully-derived model from
 * lib/coordinationTimeline.js (buildTimeline / buildPreparation) and renders the
 * nine coordination events with an icon, timestamp, live status and short
 * description, colour-coded completed (green) / current (orange) / pending
 * (gray). The hospital-preparation panel attaches under the "preparing" step
 * once that step is active. Animations are intentionally minimal — a single soft
 * pulse on the current node.
 *
 * Props:
 *   steps        — array from buildTimeline()
 *   preparation  — { vials, items } from buildPreparation()
 *   t            — active i18n table (tFor(language))
 */

/** One lucide glyph per event, in the app's icon language. */
const ICONS = {
  bite: AlertTriangle,
  gps: MapPin,
  hospital: Building2,
  route: Navigation,
  notified: PhoneCall,
  handover: Stethoscope,
  preparing: FlaskConical,
  enroute: Ambulance,
  arrival: CheckCircle2,
};

/** Status → brand tone / soft tint, matching the rest of Antidote+. */
const TONE = { completed: C.good, current: C.orange, pending: "#93A9A7" };
const PALE = { completed: C.goodPale, current: C.orangePale, pending: "#EEF3F2" };

export default function EmergencyTimeline({ steps, preparation, t }) {
  const tl = t.timeline;

  return (
    <section
      className="rounded-2xl bg-white border overflow-hidden"
      style={{ borderColor: "#E1EAE9" }}
    >
      {/* minimal current-node pulse — scoped keyframes (Shell has no global one) */}
      <style>{`@keyframes apTlPulse{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(2);opacity:0}}`}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="px-4 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: "#EEF4F3" }}
      >
        <RadioTower size={17} style={{ color: C.teal }} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-extrabold leading-tight" style={{ color: C.dark }}>
            {tl.title}
          </div>
          <div className="text-[11px] leading-tight" style={{ color: C.muted }}>
            {tl.subtitle}
          </div>
        </div>
        <span
          className="flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0"
          style={{ background: C.dangerPale, color: C.danger }}
        >
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: C.danger }}
          />
          {tl.live}
        </span>
      </div>

      {/* ── Steps ──────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        {steps.map((step, i) => {
          const Icon = ICONS[step.key] || CheckCircle2;
          const tone = TONE[step.status];
          const last = i === steps.length - 1;
          // The connector below a node is "done"-green only once this step itself
          // is completed; otherwise it stays gray (the flow hasn't reached it).
          const connectorDone = step.status === "completed";

          return (
            <div key={step.key} className="flex gap-3">
              {/* Rail: node + connector */}
              <div className="flex flex-col items-center">
                <div className="relative shrink-0">
                  {step.status === "current" && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: tone,
                        animation: "apTlPulse 1.8s ease-out infinite",
                      }}
                    />
                  )}
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: 34,
                      height: 34,
                      background: PALE[step.status],
                      border: `2px solid ${tone}`,
                      color: tone,
                    }}
                  >
                    {step.status === "completed" ? <Check size={17} strokeWidth={3} /> : <Icon size={16} />}
                  </div>
                </div>
                {!last && (
                  <div
                    className="flex-1"
                    style={{
                      width: 2,
                      minHeight: 22,
                      background: connectorDone ? C.good : "#DCE7E6",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`min-w-0 flex-1 ${last ? "pb-2" : "pb-3"}`}>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm truncate ${step.status === "pending" ? "font-semibold" : "font-bold"}`}
                    style={{ color: step.status === "pending" ? C.muted : C.dark }}
                  >
                    {step.title}
                  </span>
                  <StatusPill status={step.status} label={tl.status[step.status]} tone={tone} pale={PALE[step.status]} />
                  {step.time && (
                    <span className="ml-auto text-[11px] tabular-nums shrink-0" style={{ color: C.muted }}>
                      {step.time}
                    </span>
                  )}
                </div>

                <div className="text-xs leading-snug mt-0.5" style={{ color: C.muted }}>
                  {step.detail}
                </div>

                {step.ago && (
                  <div className="text-[11px] mt-0.5" style={{ color: TONE.completed }}>
                    {step.ago}
                  </div>
                )}

                {/* Offline queue indicator on the contact step */}
                {step.queued && (
                  <div
                    className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5"
                    style={{ background: C.amberPale }}
                  >
                    <Inbox size={13} style={{ color: C.amber }} className="shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug font-semibold" style={{ color: C.amber }}>
                      {tl.queuedNote}
                    </span>
                  </div>
                )}

                {/* Hospital preparation panel — attaches once "preparing" is active */}
                {step.key === "preparing" && step.status !== "pending" && preparation && (
                  <PreparationPanel preparation={preparation} tl={tl} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Sub-pieces ───────────────────────────────────────────────────────────── */

function StatusPill({ status, label, tone, pale }) {
  return (
    <span
      className="text-[10px] font-bold rounded-full px-1.5 py-0.5 shrink-0 uppercase tracking-wide"
      style={{ background: pale, color: tone }}
    >
      {label}
    </span>
  );
}

function PreparationPanel({ preparation, tl }) {
  return (
    <div
      className="mt-2 rounded-xl border px-3 py-2.5"
      style={{ borderColor: "#E6EFEE", background: "#F8FBFA" }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <FlaskConical size={14} style={{ color: C.teal }} />
        <span className="text-xs font-bold" style={{ color: C.dark }}>
          {tl.prepTitle}
        </span>
        <span
          className="ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums"
          style={{ background: C.tealPale, color: C.teal }}
        >
          {preparation.vials} ASV
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {preparation.items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs leading-snug" style={{ color: C.dark }}>
            <Check size={13} strokeWidth={3} style={{ color: C.good }} className="shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
