import { describe, it, expect } from "vitest";
import {
  toDisplay,
  toFahrenheit,
  hourStatus,
  weatherName,
  windDirection,
  localTime,
} from "../src/utils/weather";
import {
  decodeProduct,
  addRecent,
  initialLimits,
} from "../src/utils/productStorage";
const city = {
  id: 1,
  name: "Denver",
  region: "Colorado",
  country: "United States",
  latitude: 39.74,
  longitude: -104.99,
  timezone: "America/Denver",
};
describe("WeatherWindow product rules", () => {
  it("converts Fahrenheit to Celsius", () =>
    expect(toDisplay(32, "C")).toBe(0));
  it("converts Celsius to canonical Fahrenheit", () =>
    expect(toFahrenheit(20, "C")).toBe(68));
  it("retains Fahrenheit values when using F", () =>
    expect(toFahrenheit(55, "F")).toBe(55));
  it("classifies match and boundary", () =>
    expect(
      hourStatus(
        { time: 0, temperature: 72, wind: 12, rain: 20 },
        initialLimits,
      ),
    ).toBe("match"));
  it("classifies missing core data separately", () =>
    expect(
      hourStatus(
        { time: 0, temperature: 65, wind: null, rain: 5 },
        initialLimits,
      ),
    ).toBe("unavailable"));
  it("classifies outside-limit hours", () =>
    expect(
      hourStatus({ time: 0, temperature: 90, wind: 5, rain: 0 }, initialLimits),
    ).toBe("outside"));
  it("stores Celsius preference without converting canonical thresholds", () =>
    expect(
      decodeProduct(
        JSON.stringify({
          version: 1,
          city,
          recent: [city],
          limits: initialLimits,
          unit: "C",
        }),
      )?.limits,
    ).toEqual(initialLimits));
  it("rejects invalid product data", () =>
    expect(() => decodeProduct("{")).toThrow());
  it("rejects unsupported units", () =>
    expect(() =>
      decodeProduct(
        JSON.stringify({
          version: 1,
          city,
          recent: [],
          limits: initialLimits,
          unit: "K",
        }),
      ),
    ).toThrow());
  it("deduplicates recent cities", () =>
    expect(addRecent([city], city)).toHaveLength(1));
  it("bounds recent history", () =>
    expect(
      addRecent(
        Array.from({ length: 6 }, (_, i) => ({ ...city, id: i + 2 })),
        city,
      ),
    ).toHaveLength(5));
  it("uses city timezone rather than browser timezone", () =>
    expect(
      localTime(Date.UTC(2026, 9, 25, 12) / 1000, "America/Denver", {
        hour: "numeric",
        hour12: false,
      }),
    ).toBe("06"));
  it("labels both common weather and missing data", () => {
    expect(weatherName(3)).toBe("Overcast");
    expect(weatherName(null)).toBe("Conditions unavailable");
  });
  it("converts wind bearing to direction", () =>
    expect(windDirection(270)).toBe("W"));
});
