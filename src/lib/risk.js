/**
 * Transparent snakebite-risk indicator — NO AI, NO prediction.
 *
 * A simple, auditable points model over three inputs: season (month),
 * time of day, and a seeded per-district historical-density value. Every input
 * and its contribution is exposed to the UI so the band can always be
 * explained. This is a general indicator for an area, never a forecast for an
 * individual.
 */

/** Seeded historical-density proxy per district (0–2). Demo data only. */
export const DISTRICTS = [
  { key: "vikarabad", label: "Vikarabad", base: 2 },
  { key: "nalgonda", label: "Nalgonda", base: 2 },
  { key: "warangal", label: "Warangal", base: 1 },
  { key: "hyderabad", label: "Hyderabad", base: 0 },
];

/**
 * Season contribution (0–2). Snakebite peaks during the monsoon and the
 * post-monsoon agricultural season in India (roughly June–October).
 * @param {number} month - 0–11
 */
export function seasonScore(month) {
  if (month >= 5 && month <= 9) return 2; // Jun–Oct: peak
  if (month === 4 || month === 10) return 1; // May / Nov: shoulder
  return 0;
}

/**
 * Time-of-day contribution (0–2). Risk rises at dusk and through the night;
 * dawn farm-work carries some risk; daytime is lowest.
 * @param {number} hour - 0–23
 */
export function timeScore(hour) {
  if (hour >= 18 && hour < 23) return 2; // dusk / early night — highest
  if (hour >= 23 || hour < 5) return 1; // deep night
  if (hour >= 5 && hour < 8) return 1; // dawn
  return 0; // daytime
}

/** Map an overall 0–6 score to a band. */
export function bandFromScore(score) {
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

/** Map a single 0–2 factor to a band, for per-factor display. */
export function levelForPoints(points) {
  return points >= 2 ? "high" : points >= 1 ? "medium" : "low";
}

/**
 * Compute the overall risk band plus the transparent factor breakdown.
 * @param {{ month:number, hour:number, districtBase:number }} input
 * @returns {{ score:number, band:string, factors:Array<{key:string, points:number, level:string}> }}
 */
export function computeRisk({ month, hour, districtBase }) {
  const s = seasonScore(month);
  const tm = timeScore(hour);
  const d = districtBase;
  const score = s + tm + d;
  return {
    score,
    band: bandFromScore(score),
    factors: [
      { key: "season", points: s, level: levelForPoints(s) },
      { key: "time", points: tm, level: levelForPoints(tm) },
      { key: "density", points: d, level: levelForPoints(d) },
    ],
  };
}
