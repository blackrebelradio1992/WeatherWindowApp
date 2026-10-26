import { describe, it, expect, vi, afterEach } from "vitest";
import {
  defaultLimits,
  filterHours,
  sampleHours,
  validateLimits,
} from "../src/utils/filterHours";
import { decodePreferences } from "../src/utils/storage";
import {
  normalizeForecast,
  getForecast,
  searchCities,
  requestJson,
} from "../src/services/api";
describe("limits and filtering", () => {
  it("matches only sample A", () =>
    expect(filterHours(sampleHours, defaultLimits)).toEqual([sampleHours[0]]));
  it("includes exact boundaries", () =>
    expect(
      filterHours(
        [
          { time: 0, temperature: 60, wind: 10, rain: 30 },
          { time: 1, temperature: 75, wind: 10, rain: 30 },
        ],
        defaultLimits,
      ),
    ).toHaveLength(2));
  it("excludes missing weather", () =>
    expect(
      filterHours(
        [{ time: 0, temperature: 65, wind: null, rain: 0 }],
        defaultLimits,
      ),
    ).toHaveLength(0));
  it("rejects reversed temperatures", () =>
    expect(validateLimits({ ...defaultLimits, minTemp: 90 })).toContain(
      "Minimum",
    ));
  it("rejects negative wind", () =>
    expect(validateLimits({ ...defaultLimits, maxWind: -1 })).toContain(
      "Wind",
    ));
  it("rejects rain over 100", () =>
    expect(validateLimits({ ...defaultLimits, maxRain: 101 })).toContain(
      "Rain",
    ));
  it("rejects nonnumeric inputs", () =>
    expect(validateLimits({ ...defaultLimits, maxRain: NaN })).not.toBe(""));
  it("returns no matches for invalid limits", () =>
    expect(filterHours(sampleHours, { ...defaultLimits, maxWind: -1 })).toEqual(
      [],
    ));
});
describe("saved data", () => {
  it("accepts absent data", () => expect(decodePreferences(null)).toBeNull());
  it("restores typed data", () =>
    expect(
      decodePreferences(
        JSON.stringify({ version: 1, city: null, limits: defaultLimits }),
      )?.limits,
    ).toEqual(defaultLimits));
  it("rejects malformed JSON", () =>
    expect(() => decodePreferences("{")).toThrow());
  it("rejects old schema versions", () =>
    expect(() =>
      decodePreferences(
        JSON.stringify({ version: 0, city: null, limits: defaultLimits }),
      ),
    ).toThrow());
  it("rejects invalid city coordinates", () =>
    expect(() =>
      decodePreferences(
        JSON.stringify({
          version: 1,
          city: { latitude: 999 },
          limits: defaultLimits,
        }),
      ),
    ).toThrow());
  it("rejects numeric strings in limits", () =>
    expect(() =>
      decodePreferences(
        JSON.stringify({
          version: 1,
          city: null,
          limits: { ...defaultLimits, maxRain: "10" },
        }),
      ),
    ).toThrow());
});
describe("API boundaries", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("normalizes missing weather to null", () =>
    expect(
      normalizeForecast({
        timezone: "UTC",
        hourly: {
          time: [1],
          temperature_2m: [null],
          wind_speed_10m: [5],
          precipitation_probability: [0],
        },
      }).hours[0].temperature,
    ).toBeNull());
  it("rejects misaligned columns", () =>
    expect(() =>
      normalizeForecast({
        timezone: "UTC",
        hourly: {
          time: [1],
          temperature_2m: [],
          wind_speed_10m: [5],
          precipitation_probability: [0],
        },
      }),
    ).toThrow());
  it("rejects bad coordinates before fetching", async () => {
    await expect(getForecast(91, 0)).rejects.toThrow("coordinates");
  });
  it("rejects short city queries", async () => {
    await expect(searchCities(" ")).rejects.toThrow("two");
  });
  it("surfaces HTTP failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429 }),
    );
    await expect(requestJson("https://example.test")).rejects.toThrow("429");
  });
  it("handles no city results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
    );
    await expect(searchCities("NoCity")).resolves.toEqual([]);
  });
});
