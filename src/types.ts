export interface City {
  id: number;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
export interface Limits {
  minTemp: number;
  maxTemp: number;
  maxWind: number;
  maxRain: number;
}
export interface Hour {
  feelsLike?: number | null;
  humidity?: number | null;
  weatherCode?: number | null;
  windDirection?: number | null;
  gusts?: number | null;
  precipitation?: number | null;
  cloud?: number | null;
  time: number;
  temperature: number | null;
  wind: number | null;
  rain: number | null;
}
export interface Forecast {
  hours: Hour[];
  timezone: string;
  fetchedAt: string;
}
export interface Preferences {
  version: 1;
  city: City | null;
  limits: Limits;
}
