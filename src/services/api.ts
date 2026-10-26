import type { City, Forecast, Hour } from "../types";
export async function requestJson(
  url: string,
  signal?: AbortSignal,
): Promise<any> {
  const response = await fetch(url, { signal });
  if (!response.ok)
    throw new Error(`Request failed (HTTP ${response.status}). Please retry.`);
  return response.json();
}
export async function searchCities(
  name: string,
  signal?: AbortSignal,
): Promise<City[]> {
  const q = name.trim();
  if (q.length < 2) throw new Error("Enter at least two characters.");
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({
    name: q,
    count: "5",
    language: "en",
    format: "json",
  }).toString();
  const data = await requestJson(url.toString(), signal);
  if (data.results !== undefined && !Array.isArray(data.results))
    throw new Error("Unexpected city response.");
  return (data.results ?? [])
    .filter(
      (r: any) =>
        Number.isFinite(r.id) &&
        Number.isFinite(r.latitude) &&
        Number.isFinite(r.longitude) &&
        typeof r.name === "string",
    )
    .map((r: any) => ({
      id: r.id,
      name: r.name,
      region: r.admin1 ?? "",
      country: r.country ?? "",
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone ?? "UTC",
    }));
}
export function normalizeForecast(data: any): Forecast {
  const h = data?.hourly;
  if (!h || !Array.isArray(h.time) || typeof data.timezone !== "string")
    throw new Error("Unexpected forecast response.");
  const keys = [
    "temperature_2m",
    "wind_speed_10m",
    "precipitation_probability",
  ];
  if (keys.some((k) => !Array.isArray(h[k]) || h[k].length !== h.time.length))
    throw new Error("Forecast columns have different lengths.");
  const value = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  const hours: Hour[] = h.time
    .map((time: unknown, i: number) => ({
      time,
      temperature: value(h.temperature_2m[i]),
      wind: value(h.wind_speed_10m[i]),
      rain: value(h.precipitation_probability[i]),
      feelsLike: value(h.apparent_temperature?.[i]),
      humidity: value(h.relative_humidity_2m?.[i]),
      weatherCode: value(h.weather_code?.[i]),
      windDirection: value(h.wind_direction_10m?.[i]),
      gusts: value(h.wind_gusts_10m?.[i]),
      precipitation: value(h.precipitation?.[i]),
      cloud: value(h.cloud_cover?.[i]),
    }))
    .filter((v: any) => typeof v.time === "number" && Number.isFinite(v.time));
  return {
    hours,
    timezone: data.timezone,
    fetchedAt: new Date().toISOString(),
  };
}
export async function getForecast(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<Forecast> {
  if (
    !Number.isFinite(lat) ||
    Math.abs(lat) > 90 ||
    !Number.isFinite(lon) ||
    Math.abs(lon) > 180
  )
    throw new Error(
      "Enter valid coordinates: latitude -90 to 90, longitude -180 to 180.",
    );
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly:
      "temperature_2m,wind_speed_10m,precipitation_probability,apparent_temperature,relative_humidity_2m,weather_code,wind_direction_10m,wind_gusts_10m,precipitation,cloud_cover",
    precipitation_unit: "inch",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    timeformat: "unixtime",
    forecast_hours: "48",
  }).toString();
  return normalizeForecast(await requestJson(url.toString(), signal));
}
