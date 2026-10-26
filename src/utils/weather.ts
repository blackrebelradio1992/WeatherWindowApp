import type { Hour, Limits } from "../types";
export type Unit = "F" | "C";
export const toDisplay = (f: number, unit: Unit) =>
  unit === "C"
    ? Math.round((((f - 32) * 5) / 9) * 10) / 10
    : Math.round(f * 10) / 10;
export const toFahrenheit = (value: number, unit: Unit) =>
  unit === "C" ? (value * 9) / 5 + 32 : value;
export function hourStatus(h: Hour, limits: Limits) {
  if (h.temperature === null || h.wind === null || h.rain === null)
    return "unavailable";
  return h.temperature >= limits.minTemp &&
    h.temperature <= limits.maxTemp &&
    h.wind <= limits.maxWind &&
    h.rain <= limits.maxRain
    ? "match"
    : "outside";
}
export function localTime(
  time: number,
  zone: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    ...options,
  }).format(new Date(time * 1000));
}
export const timeLabel = (time: number, zone: string) =>
  localTime(time, zone, { hour: "numeric", minute: "2-digit" });
export const dateLabel = (time: number, zone: string) =>
  localTime(time, zone, { weekday: "short", month: "short", day: "numeric" });
export function weatherName(code: number | null | undefined) {
  if (code == null) return "Conditions unavailable";
  if (code === 0) return "Clear sky";
  if (code <= 3)
    return ["", "Mainly clear", "Partly cloudy", "Overcast"][code] ?? "Cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}
export function windDirection(degrees: number | null | undefined) {
  if (degrees == null) return "Unavailable";
  return [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ][Math.round(degrees / 22.5) % 16];
}
