import type { Hour, Limits } from "../types";
export const defaultLimits: Limits = {
  minTemp: 60,
  maxTemp: 75,
  maxWind: 10,
  maxRain: 30,
};
export function validateLimits(l: Limits): string {
  if (!Object.values(l).every(Number.isFinite))
    return "Enter a number in every limit field.";
  if (l.minTemp > l.maxTemp)
    return "Minimum temperature must not exceed maximum temperature.";
  if (l.maxWind < 0) return "Wind speed must be zero or greater.";
  if (l.maxRain < 0 || l.maxRain > 100)
    return "Rain probability must be between 0 and 100.";
  return "";
}
export function filterHours(hours: Hour[], l: Limits): Hour[] {
  if (validateLimits(l)) return [];
  return hours.filter(
    (h) =>
      h.temperature !== null &&
      h.wind !== null &&
      h.rain !== null &&
      [h.temperature, h.wind, h.rain].every(Number.isFinite) &&
      h.temperature >= l.minTemp &&
      h.temperature <= l.maxTemp &&
      h.wind <= l.maxWind &&
      h.rain <= l.maxRain,
  );
}
export const sampleHours: Hour[] = [
  { time: 0, temperature: 65, wind: 5, rain: 10 },
  { time: 3600, temperature: 80, wind: 8, rain: 20 },
  { time: 7200, temperature: 70, wind: 18, rain: 15 },
  { time: 10800, temperature: 68, wind: 6, rain: 60 },
];
