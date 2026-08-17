import { LatLng } from "./types";

const KM_PER_LAT_DEGREE = 111.32;

function ellipseCircumference(a: number, b: number) {
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

function solveMajorAxisKm(targetCircumferenceKm: number, aspectRatio: number) {
  let lo = 0.01;
  let hi = targetCircumferenceKm;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const circumference = ellipseCircumference(mid, mid * aspectRatio);
    if (circumference > targetCircumferenceKm) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

interface RouteLoopOptions {
  center: LatLng;
  distanceKm: number;
  seed: number;
  /** compass bearing in degrees (0 = north, 90 = east) that the long axis follows */
  bearingDeg?: number;
  /** minor/major axis ratio — 1 = circular loop, closer to 0 = narrow ribbon along the bearing */
  aspectRatio?: number;
  /**
   * Hard cap (km) on the major axis. Without real road/park-boundary data we
   * can't guarantee an eyeballed center sits far enough from water, so for
   * narrow riverside/linear-park courses this keeps the loop compact enough
   * to stay on land even if the center estimate is off by a bit.
   */
  maxMajorAxisKm?: number;
}

/**
 * Generates a closed loop route shaped as a (slightly organic) ellipse oriented
 * along a real-world bearing, so riverside/linear-park courses read as narrow
 * ribbons instead of circles that bleed across water, while genuine loop
 * courses (park perimeters, mountain roads) stay near-circular.
 */
export function generateRouteLoop({
  center,
  distanceKm,
  seed,
  bearingDeg = 0,
  aspectRatio = 0.85,
  maxMajorAxisKm,
}: RouteLoopOptions): LatLng[] {
  const steps = 48;
  const latDegPerKm = 1 / KM_PER_LAT_DEGREE;
  const lngDegPerKm =
    1 / (KM_PER_LAT_DEGREE * Math.cos((center.lat * Math.PI) / 180));
  const bearingRad = (bearingDeg * Math.PI) / 180;

  const solvedMajorAxisKm = solveMajorAxisKm(distanceKm, aspectRatio);
  const majorAxisKm = maxMajorAxisKm
    ? Math.min(solvedMajorAxisKm, maxMajorAxisKm)
    : solvedMajorAxisKm;
  const minorAxisKm = majorAxisKm * aspectRatio;

  const points: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + 0.06 * Math.sin(t * 3 + seed);
    const alongAxis = majorAxisKm * Math.cos(t) * wobble;
    const acrossAxis = minorAxisKm * Math.sin(t) * wobble;

    const east = alongAxis * Math.sin(bearingRad) + acrossAxis * Math.cos(bearingRad);
    const north = alongAxis * Math.cos(bearingRad) - acrossAxis * Math.sin(bearingRad);

    points.push({
      lat: Number((center.lat + north * latDegPerKm).toFixed(6)),
      lng: Number((center.lng + east * lngDegPerKm).toFixed(6)),
    });
  }
  return points;
}

/**
 * Picks a point directly on an already-generated route (0 = start, 1 = end
 * looping back to start). Reusing verified route points — rather than
 * inventing new offset coordinates — guarantees amenity markers land on the
 * same safe path instead of risking another water-crossing mistake.
 */
export function pointOnRoute(route: LatLng[], fraction: number): LatLng {
  const idx = Math.round(fraction * (route.length - 1));
  return route[Math.max(0, Math.min(route.length - 1, idx))];
}
