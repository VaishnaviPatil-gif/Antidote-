import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Navigation2, X, Gauge, MapPin, Clock, Crosshair, Loader2,
  RouteOff, ShieldAlert, CheckCircle2, RefreshCw, Building2, Target,
} from "lucide-react";
import { C, SCREEN_BG, FRAME_BG } from "../theme.js";
import { tFor } from "../i18n.js";
import { useGeolocation } from "../hooks/useGeolocation.js";
import {
  haversineKm, haversineM, etaMin, mpsToKmh, derivedKmh,
  formatDistance, formatDuration, formatClock, formatCoords,
  MIN_MOVING_KMH, ARRIVAL_RADIUS_M, RECALC_THRESHOLD_M,
} from "../lib/geo.js";

/**
 * NavigationOverlay — real-time emergency navigation (Priority 2).
 *
 * Mounted full-bleed by the Routing hero when the user starts navigation, so
 * the routing screen underneath is never modified. It owns the live location
 * stream (via useGeolocation: Capacitor on Android, browser geolocation in the
 * web preview), recomputes distance / ETA / speed every fix, recalculates the
 * remaining route on significant movement, and degrades honestly when the GPS
 * is denied or still acquiring.
 *
 * Props:
 *   destination — full facility { name, lat, lng, tierKey, vials, icu }
 *   origin      — { lat, lng } victim start, used until the first live fix
 *   language    — "te" | "hi" | "en"
 *   onEnd       — called when the user ends navigation (stops tracking)
 */
export default function NavigationOverlay({ destination, origin, language, onEnd }) {
  const t = tFor(language);
  const nt = t.navigation;
  const { position, lastKnown, status, retry } = useGeolocation({
    enabled: true,
    intervalMs: 5000,
  });

  // Per-fix derived values held across renders.
  const prevRef = useRef(null); // previous fix (for derived speed)
  const recalcAnchorRef = useRef(null); // last point we "recalculated" from
  const startDistanceRef = useRef(null); // initial remaining distance (progress)
  const [speedKmh, setSpeedKmh] = useState(null);
  const [recalced, setRecalced] = useState(false);

  // The freshest usable location: a live fix, else the last known one, else the
  // seeded victim origin so the banner is never empty on first paint.
  const current = position || lastKnown || origin || null;
  const usingLastKnown = !position && !!lastKnown;

  const hasDest =
    destination && destination.lat != null && destination.lng != null;
  const distanceKm = current && hasDest ? haversineKm(current, destination) : null;
  const arrived =
    distanceKm != null && distanceKm * 1000 <= ARRIVAL_RADIUS_M;
  const eta = distanceKm != null ? etaMin(distanceKm, speedKmh) : null;

  // Capture the initial remaining distance once, for the progress bar.
  if (startDistanceRef.current == null && distanceKm != null) {
    startDistanceRef.current = distanceKm;
  }
  const progress = useMemo(() => {
    const start = startDistanceRef.current;
    if (!start || distanceKm == null) return 0;
    return Math.min(1, Math.max(0, 1 - distanceKm / start));
  }, [distanceKm]);

  // On every new fix: update speed + detect a significant move (recalculation).
  useEffect(() => {
    if (!position) return;
    const gps = mpsToKmh(position.speed);
    const derived = derivedKmh(prevRef.current, position);
    const v = gps != null ? gps : derived;
    if (v != null) setSpeedKmh(v);

    if (!recalcAnchorRef.current) {
      recalcAnchorRef.current = position;
    } else if (haversineM(recalcAnchorRef.current, position) > RECALC_THRESHOLD_M) {
      recalcAnchorRef.current = position;
      setRecalced(true);
    }
    prevRef.current = position;
  }, [position]);

  // Auto-clear the transient "route updated" flash.
  useEffect(() => {
    if (!recalced) return undefined;
    const id = setTimeout(() => setRecalced(false), 1800);
    return () => clearTimeout(id);
  }, [recalced]);

  const movingKmh = speedKmh != null && speedKmh >= MIN_MOVING_KMH ? speedKmh : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={nt.bannerTitle}
      className="fixed inset-0 z-50 flex justify-center"
      style={{ background: SCREEN_BG }}
    >
      <style>{`
        @keyframes navPulse { 0%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.82)} 100%{opacity:1;transform:scale(1)} }
        @keyframes navSheen { 0%{background-position:-120% 0} 100%{background-position:220% 0} }
        .nav-dot { animation: navPulse 1.3s ease-in-out infinite; }
        .nav-flash { animation: navSheen 1.4s linear infinite; }
      `}</style>

      <div
        className="w-full max-w-frame flex flex-col"
        style={{ background: FRAME_BG, minHeight: "100vh" }}
      >
        {/* ── Persistent emergency banner ──────────────────────────── */}
        <header
          className="px-4 pt-4 pb-3 text-white"
          style={{
            background: `linear-gradient(135deg, ${C.orange} 0%, #C85410 100%)`,
            paddingTop: "calc(16px + env(safe-area-inset-top, 0px))",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="nav-dot inline-flex items-center justify-center rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,.22)", width: 30, height: 30 }}
            >
              <Navigation2 size={16} fill="#fff" />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-wide flex-1">
              {nt.bannerTitle}
            </span>
            <button
              onClick={onEnd}
              aria-label={nt.end}
              className="rounded-full p-1.5 active:scale-95 transition-transform"
              style={{ background: "rgba(255,255,255,.18)" }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "#FFE2CF" }}>
                {nt.to}
              </div>
              <div className="text-lg font-extrabold leading-tight truncate flex items-center gap-1.5">
                <Building2 size={16} className="shrink-0" />
                {destination?.name || "—"}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-extrabold tabular-nums leading-none">
                {formatDistance(distanceKm)}
              </div>
              <div className="text-xs font-semibold" style={{ color: "#FFE2CF" }}>
                {nt.eta} {formatDuration(eta)}
              </div>
            </div>
          </div>
        </header>

        {/* ── Body: arrival / denied / acquiring / live ────────────── */}
        <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
          {arrived ? (
            <ArrivedCard nt={nt} destination={destination} />
          ) : status === "denied" ? (
            <PermissionCard nt={nt} onRetry={retry} />
          ) : (
            <>
              {/* Acquiring / unavailable notices (kept inline so the last known
                  distance above stays visible while we re-acquire a fix). */}
              {status === "requesting" && !current && (
                <StatusCard
                  tone={C.teal}
                  pale={C.tealPale}
                  icon={<Loader2 size={18} className="ap-spin" />}
                  title={nt.acquiring}
                />
              )}
              {status === "unavailable" && (
                <StatusCard
                  tone={C.amber}
                  pale={C.amberPale}
                  icon={<RouteOff size={18} />}
                  title={nt.gpsTitle}
                  body={nt.gpsBody}
                  action={{ label: nt.retry, onClick: retry }}
                />
              )}
              {usingLastKnown && status !== "unavailable" && (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
                  style={{ background: C.amberPale, color: C.amber }}
                >
                  <ShieldAlert size={14} />
                  {nt.lastKnownNote}
                </div>
              )}

              {/* Route progress + recalculation flash */}
              <div className="rounded-2xl bg-white border px-4 py-3" style={{ borderColor: "#E1EAE9" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.muted }}>
                    {nt.distanceLeft}
                  </span>
                  {recalced && (
                    <span
                      className="flex items-center gap-1 text-xs font-bold rounded-full px-2 py-0.5"
                      style={{ background: C.tealPale, color: C.teal }}
                    >
                      <RefreshCw size={11} />
                      {nt.recalculating}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-extrabold tabular-nums" style={{ color: C.dark }}>
                  {formatDistance(distanceKm)}
                </div>
                {/* progress track */}
                <div className="mt-2.5 h-2 rounded-full overflow-hidden" style={{ background: "#E6EFEE" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(progress * 100)}%`, background: C.orange }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-xs" style={{ color: C.muted }}>
                  <span className="flex items-center gap-1">
                    <Crosshair size={12} style={{ color: C.teal }} /> {nt.to}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={12} style={{ color: C.orange }} />
                    {destination?.name?.split(",")[0]}
                  </span>
                </div>
              </div>

              {/* Live stat grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <NavStat
                  icon={<Gauge size={16} />}
                  value={`${Math.round(movingKmh)}`}
                  unit={nt.kmh}
                  label={nt.speed}
                  tone={C.teal}
                />
                <NavStat
                  icon={<Clock size={16} />}
                  value={formatClock(eta)}
                  label={nt.arrival}
                  tone={C.orange}
                />
                <NavStat
                  icon={<Clock size={16} />}
                  value={formatDuration(eta)}
                  label={nt.eta}
                  tone={C.teal}
                />
                <NavStat
                  icon={<MapPin size={16} />}
                  value={
                    current?.accuracy != null
                      ? `±${Math.round(current.accuracy)} m`
                      : "—"
                  }
                  label={nt.accuracy}
                  tone={C.muted}
                />
              </div>

              {/* Current coordinates */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3 bg-white border"
                style={{ borderColor: "#E1EAE9" }}
              >
                <div className="rounded-lg p-2 shrink-0" style={{ background: C.tealPale }}>
                  <Crosshair size={16} style={{ color: C.teal }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs" style={{ color: C.muted }}>{nt.coords}</div>
                  <div className="text-sm font-semibold tabular-nums truncate" style={{ color: C.dark }}>
                    {formatCoords(current)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── End navigation ───────────────────────────────────────── */}
        <div
          className="px-4 pt-2 pb-4"
          style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            onClick={onEnd}
            className="w-full rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[.98] transition-transform border bg-white"
            style={{ borderColor: C.danger, color: C.danger, height: 52, fontSize: 16 }}
          >
            <X size={18} />
            {nt.end}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Presentational pieces ───────────────────────────────────────────────── */

function NavStat({ icon, value, unit, label, tone }) {
  return (
    <div className="rounded-2xl bg-white border px-3 py-2.5" style={{ borderColor: "#E8F0EF" }}>
      <div className="flex items-center gap-1.5" style={{ color: tone }}>
        {icon}
        <span className="text-xl font-extrabold tabular-nums leading-none">
          {value}
          {unit && <span className="text-xs font-semibold ml-0.5">{unit}</span>}
        </span>
      </div>
      <div className="text-xs mt-1" style={{ color: "#6E8A88" }}>{label}</div>
    </div>
  );
}

function StatusCard({ tone, pale, icon, title, body, action }) {
  return (
    <div className="rounded-2xl px-4 py-3 flex items-start gap-3" style={{ background: pale }}>
      <span className="shrink-0 mt-0.5" style={{ color: tone }}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold" style={{ color: tone }}>{title}</div>
        {body && <div className="text-xs leading-snug mt-0.5" style={{ color: C.dark }}>{body}</div>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white active:scale-95 transition-transform"
            style={{ background: tone }}
          >
            <RefreshCw size={12} />
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

function PermissionCard({ nt, onRetry }) {
  return (
    <div
      className="rounded-2xl px-4 py-4 flex flex-col items-center text-center gap-2"
      style={{ background: C.dangerPale, border: `1px solid #F0CFC9` }}
    >
      <div className="rounded-full p-3" style={{ background: "#F6D9D4" }}>
        <ShieldAlert size={26} style={{ color: C.danger }} />
      </div>
      <div className="text-base font-extrabold" style={{ color: C.danger }}>{nt.permTitle}</div>
      <div className="text-sm leading-snug" style={{ color: C.dark }}>{nt.permBody}</div>
      <button
        onClick={onRetry}
        className="mt-1 w-full rounded-xl text-white font-bold flex items-center justify-center gap-2 active:scale-[.98] transition-transform"
        style={{ background: C.danger, height: 48, fontSize: 15 }}
      >
        <RefreshCw size={16} />
        {nt.permRetry}
      </button>
    </div>
  );
}

function ArrivedCard({ nt, destination }) {
  return (
    <div
      className="rounded-2xl px-4 py-6 flex flex-col items-center text-center gap-2"
      style={{ background: C.goodPale, border: `1px solid #BBE3CE` }}
    >
      <div className="rounded-full p-3" style={{ background: "#CDEBDC" }}>
        <CheckCircle2 size={30} style={{ color: C.good }} />
      </div>
      <div className="text-lg font-extrabold" style={{ color: C.good }}>{nt.arrivedTitle}</div>
      <div className="text-base font-bold" style={{ color: C.dark }}>{destination?.name}</div>
      <div className="text-sm leading-snug" style={{ color: C.muted }}>{nt.arrivedBody}</div>
    </div>
  );
}
