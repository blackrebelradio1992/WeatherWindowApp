import type { City, Preferences } from "../types";
import { validateLimits } from "./filterHours";
export const STORAGE_KEY = "technology-demo-lab-preferences";
export function validCity(c: unknown): c is City {
  if (!c || typeof c !== "object") return false;
  const v = c as City;
  return (
    Number.isFinite(v.id) &&
    typeof v.name === "string" &&
    typeof v.region === "string" &&
    typeof v.country === "string" &&
    typeof v.timezone === "string" &&
    Number.isFinite(v.latitude) &&
    Math.abs(v.latitude) <= 90 &&
    Number.isFinite(v.longitude) &&
    Math.abs(v.longitude) <= 180
  );
}
export function decodePreferences(raw: string | null): Preferences | null {
  if (raw === null) return null;
  const p = JSON.parse(raw) as Preferences;
  if (
    !p ||
    p.version !== 1 ||
    !p.limits ||
    Object.keys(p.limits).sort().join(",") !==
      "maxRain,maxTemp,maxWind,minTemp" ||
    validateLimits(p.limits) ||
    (p.city !== null && !validCity(p.city))
  )
    throw new Error("Saved data is invalid. Clear it and save again.");
  return p;
}
export function savePreferences(p: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
export function loadPreferences() {
  return decodePreferences(localStorage.getItem(STORAGE_KEY));
}
export function clearPreferences() {
  localStorage.removeItem(STORAGE_KEY);
}
