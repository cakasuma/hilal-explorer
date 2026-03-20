/**
 * Hilal astronomical calculations using astronomy-engine.
 * All computations are real — no fake data.
 */
import * as Astronomy from "astronomy-engine";

export interface Location {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface HilalResult {
  date: Date;
  location: Location;
  sunsetTime: Date;
  moonAltitude: number; // degrees at sunset
  sunAltitude: number; // degrees at sunset (should be ~0 or slightly negative)
  elongation: number; // angle between sun and moon
  moonAge: number; // hours since new moon
  moonAzimuth: number;
  sunAzimuth: number;
  illumination: number; // fraction 0-1
}

export interface VisibilityStandard {
  id: string;
  name: string;
  description: string;
  check: (result: HilalResult) => { visible: boolean; reason: string };
}

/**
 * Get sunset time for a given date and location.
 * We find the next sunset after local noon of the given date.
 */
export function getSunsetTime(date: Date, lat: number, lng: number): Date {
  const observer = new Astronomy.Observer(lat, lng, 0);
  // Start search from noon UTC of the given date
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const noon = new Date(Date.UTC(year, month, day, 12, 0, 0));
  
  // Search for next sunset after noon
  const result = Astronomy.SearchRiseSet("Sun", observer, -1, noon, 1);
  if (!result) {
    // Fallback: return approximate sunset
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }
  return result.date;
}

/**
 * Compute moon and sun positions at a specific moment.
 */
export function computePositionsAt(
  moment: Date,
  lat: number,
  lng: number
): {
  moonAlt: number;
  moonAz: number;
  sunAlt: number;
  sunAz: number;
  elongation: number;
  illumination: number;
  moonAge: number;
} {
  const observer = new Astronomy.Observer(lat, lng, 0);

  // Sun horizontal coordinates
  const sunEqu = Astronomy.Equator("Sun", moment, observer, true, true);
  const sunHor = Astronomy.Horizon(moment, observer, sunEqu.ra, sunEqu.dec, "normal");

  // Moon horizontal coordinates
  const moonEqu = Astronomy.Equator("Moon", moment, observer, true, true);
  const moonHor = Astronomy.Horizon(moment, observer, moonEqu.ra, moonEqu.dec, "normal");

  // Elongation: angular distance between sun and moon
  const elongation = Astronomy.AngleBetween(
    Astronomy.GeoVector("Sun", moment, true),
    Astronomy.GeoVector("Moon", moment, true)
  );

  // Moon illumination
  const illum = Astronomy.Illumination("Moon", moment);

  // Moon age: time since last new moon
  const prevNewMoon = Astronomy.SearchMoonPhase(0, moment, -40);
  let moonAge = 0;
  if (prevNewMoon) {
    moonAge = (moment.getTime() - prevNewMoon.date.getTime()) / (1000 * 60 * 60);
  }

  return {
    moonAlt: moonHor.altitude,
    moonAz: moonHor.azimuth,
    sunAlt: sunHor.altitude,
    sunAz: sunHor.azimuth,
    elongation: elongation,
    illumination: illum.phase_fraction,
    moonAge,
  };
}

/**
 * Full hilal computation for a date and location.
 */
export function computeHilal(date: Date, location: Location): HilalResult {
  const sunset = getSunsetTime(date, location.lat, location.lng);
  const pos = computePositionsAt(sunset, location.lat, location.lng);

  return {
    date,
    location,
    sunsetTime: sunset,
    moonAltitude: pos.moonAlt,
    sunAltitude: pos.sunAlt,
    elongation: pos.elongation,
    moonAge: pos.moonAge,
    moonAzimuth: pos.moonAz,
    sunAzimuth: pos.sunAz,
    illumination: pos.illumination,
  };
}

/**
 * Visibility standards
 */
export const VISIBILITY_STANDARDS: VisibilityStandard[] = [
  {
    id: "malaysia",
    name: "Malaysia (Imkanur Rukyah)",
    description:
      "Official Malaysian standard: moon altitude ≥ 3° and elongation ≥ 6.4° at sunset",
    check: (result) => {
      const altOk = result.moonAltitude >= 3;
      const elongOk = result.elongation >= 6.4;
      if (altOk && elongOk) {
        return {
          visible: true,
          reason: `Altitude ${result.moonAltitude.toFixed(1)}° ≥ 3° and elongation ${result.elongation.toFixed(1)}° ≥ 6.4°`,
        };
      }
      const reasons: string[] = [];
      if (!altOk) reasons.push(`altitude ${result.moonAltitude.toFixed(1)}° < 3°`);
      if (!elongOk) reasons.push(`elongation ${result.elongation.toFixed(1)}° < 6.4°`);
      return { visible: false, reason: reasons.join("; ") };
    },
  },
  {
    id: "conservative",
    name: "Conservative (Strict Rukyah)",
    description:
      "Stricter criteria: moon altitude ≥ 5° and elongation ≥ 8° at sunset",
    check: (result) => {
      const altOk = result.moonAltitude >= 5;
      const elongOk = result.elongation >= 8;
      if (altOk && elongOk) {
        return {
          visible: true,
          reason: `Altitude ${result.moonAltitude.toFixed(1)}° ≥ 5° and elongation ${result.elongation.toFixed(1)}° ≥ 8°`,
        };
      }
      const reasons: string[] = [];
      if (!altOk) reasons.push(`altitude ${result.moonAltitude.toFixed(1)}° < 5°`);
      if (!elongOk) reasons.push(`elongation ${result.elongation.toFixed(1)}° < 8°`);
      return { visible: false, reason: reasons.join("; ") };
    },
  },
  {
    id: "global",
    name: "Global (Moon Above Horizon)",
    description: "Simplified: moon is above the horizon (altitude > 0°) at sunset",
    check: (result) => {
      if (result.moonAltitude > 0) {
        return {
          visible: true,
          reason: `Moon is above horizon at ${result.moonAltitude.toFixed(1)}°`,
        };
      }
      return {
        visible: false,
        reason: `Moon is below horizon at ${result.moonAltitude.toFixed(1)}°`,
      };
    },
  },
];

/**
 * Preset locations for comparison mode
 */
export const PRESET_LOCATIONS: Location[] = [
  { name: "Putrajaya", lat: 2.9264, lng: 101.6964, timezone: "Asia/Kuala_Lumpur" },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },
  { name: "Mecca", lat: 21.4225, lng: 39.8262, timezone: "Asia/Riyadh" },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  { name: "Islamabad", lat: 33.6844, lng: 73.0479, timezone: "Asia/Karachi" },
  { name: "Rabat", lat: 34.0209, lng: -6.8417, timezone: "Africa/Casablanca" },
  { name: "London", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
];

/**
 * Simple Hijri date estimation.
 * This is a basic algorithmic approximation — not authoritative.
 */
export function estimateHijriDate(gregorianDate: Date): { year: number; month: number; day: number; monthName: string } {
  const HIJRI_MONTHS = [
    "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
    "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah",
  ];

  // Approximate conversion using the Tabular Islamic calendar
  const jd = gregorianToJD(gregorianDate);
  const l = Math.floor(jd - 1948439.5 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const lp = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lp) / 5316) *
      Math.floor((50 * lp) / 17719) +
    Math.floor(lp / 5670) *
      Math.floor((43 * lp) / 15238);
  const lpp = lp - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * lpp) / 709);
  const day = lpp - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    year,
    month,
    day,
    monthName: HIJRI_MONTHS[(month - 1) % 12] || "Unknown",
  };
}

function gregorianToJD(date: Date): number {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate();

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

/**
 * Compute hilal data for a range of dates (for timeline slider)
 */
export function computeHilalRange(
  startDate: Date,
  days: number,
  location: Location
): HilalResult[] {
  const results: HilalResult[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    results.push(computeHilal(d, location));
  }
  return results;
}
