import type { City, Limits } from "../types";
import type { Unit } from "./weather";
import { validCity } from "./storage";
import { validateLimits } from "./filterHours";
export const PRODUCT_KEY = "weatherwindow-preferences-v1";
export interface ProductPreferences {
  version: 1;
  city: City | null;
  recent: City[];
  limits: Limits;
  unit: Unit;
}
export const initialLimits: Limits = {
  minTemp: 55,
  maxTemp: 72,
  maxWind: 12,
  maxRain: 20,
};
export function decodeProduct(raw: string | null): ProductPreferences | null {
  if (!raw) return null;
  const p = JSON.parse(raw) as ProductPreferences;
  if (
    !p ||
    p.version !== 1 ||
    !p.limits ||
    Object.keys(p.limits).sort().join(",") !==
      "maxRain,maxTemp,maxWind,minTemp" ||
    validateLimits(p.limits) ||
    (p.city !== null && !validCity(p.city)) ||
    !Array.isArray(p.recent) ||
    !p.recent.every(validCity) ||
    !["F", "C"].includes(p.unit)
  )
    throw new Error(
      "Saved preferences could not be read. New preferences will replace them.",
    );
  return { ...p, recent: p.recent.slice(0, 5) };
}
export function addRecent(recent: City[], city: City) {
  return [city, ...recent.filter((c) => c.id !== city.id)].slice(0, 5);
}
