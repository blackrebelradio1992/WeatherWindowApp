import { test, expect } from "@playwright/test";
const city = {
  id: 5419384,
  name: "Denver",
  admin1: "Colorado",
  country: "United States",
  latitude: 39.74,
  longitude: -104.99,
  timezone: "America/Denver",
};
const start = Date.UTC(2026, 9, 25, 14) / 1000;
const response = {
  timezone: "America/Denver",
  hourly: {
    time: Array.from({ length: 48 }, (_, i) => start + i * 3600),
    temperature_2m: Array.from({ length: 48 }, (_, i) => (i < 9 ? 60 : 85)),
    wind_speed_10m: Array.from({ length: 48 }, (_, i) => (i === 10 ? null : 7)),
    precipitation_probability: Array.from({ length: 48 }, () => 5),
    apparent_temperature: Array(48).fill(58),
    relative_humidity_2m: Array(48).fill(42),
    weather_code: Array(48).fill(2),
    wind_direction_10m: Array(48).fill(270),
    wind_gusts_10m: Array(48).fill(11),
    precipitation: Array(48).fill(0),
    cloud_cover: Array(48).fill(35),
  },
};
test.beforeEach(async ({ page }) => {
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ json: { results: [city] } }),
  );
  await page.route("https://api.open-meteo.com/**", (r) =>
    r.fulfill({ json: response }),
  );
  await page.goto("/");
});
async function select(page: any) {
  await page.getByRole("searchbox", { name: "City", exact: true }).fill("Den");
  await page.getByRole("button", { name: /Denver.*Colorado/ }).click();
  await expect(page.locator(".hour-card")).toHaveCount(9);
}
test("main product follows the wireframe flow and expands real hour details", async ({
  page,
}) => {
  await select(page);
  await expect(page.getByRole("link", { name: /demo/i })).toHaveCount(0);
  await expect(page.locator(".timeline-track button")).toHaveCount(48);
  await expect(page.locator(".hour-card")).toHaveCount(9);
  await page.locator(".hour-summary").first().click();
  await expect(page.locator(".hour-detail")).toContainText("Partly cloudy");
  await expect(page.locator(".hour-detail")).toContainText(
    "60°F compared with 55–72°F",
  );
  await expect(page.locator(".hour-detail")).toContainText("Humidity 42%");
  await page.locator(".hour-summary").first().click();
  await expect(page.locator(".hour-detail")).toHaveCount(0);
});
test("limits update immediately, preserve units, and survive reload", async ({
  page,
}) => {
  await select(page);
  await page.getByRole("button", { name: "°C", exact: true }).click();
  await expect(page.getByRole("spinbutton", { name: /^Minimum/ })).toHaveValue(
    "12.8",
  );
  await expect(page.locator(".hour-card")).toHaveCount(9);
  await page.getByLabel("Maximum rain", { exact: true }).fill("0");
  await expect(
    page.getByRole("heading", { name: /^No hours match/ }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Maximum rain", { exact: true })).toHaveValue(
    "0",
  );
  await expect(
    page.getByRole("button", { name: "°C", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("city search supports no-results and recently selected cities", async ({
  page,
}) => {
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ json: {} }),
  );
  await page.getByRole("searchbox", { name: "City", exact: true }).fill("zzz");
  await expect(page.locator(".search-results")).toContainText(
    "No cities found",
  );
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ json: { results: [city] } }),
  );
  await select(page);
  await page.getByRole("button", { name: "Change", exact: true }).click();
  await expect(page.locator(".result-label")).toContainText("RECENTLY USED");
  await page.getByRole("button", { name: /Denver.*Colorado/ }).click();
  await expect(page.locator(".hour-card")).toHaveCount(9);
});
test("forecast failure retains city and limits and Retry recovers", async ({
  page,
}) => {
  await page.route("https://api.open-meteo.com/**", (r) =>
    r.fulfill({ status: 503, json: {} }),
  );
  await page.getByRole("searchbox", { name: "City", exact: true }).fill("Den");
  await page.getByRole("button", { name: /Denver.*Colorado/ }).click();
  await expect(
    page.getByRole("heading", { name: "We couldn’t load the forecast." }),
  ).toBeVisible();
  await expect(page.getByLabel("Maximum rain", { exact: true })).toHaveValue(
    "20",
  );
  await page.route("https://api.open-meteo.com/**", (r) =>
    r.fulfill({ json: response }),
  );
  await page
    .getByRole("button", { name: "Retry forecast", exact: true })
    .click();
  await expect(page.locator(".hour-card")).toHaveCount(9);
});
test("mobile bottom sheet opens, edits, closes and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await select(page);
  await page
    .getByRole("button", { name: "Adjust limits", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Maximum rain", { exact: true }).fill("0");
  await expect(dialog).toContainText("0 hours match");
  await page.getByRole("button", { name: "Close limits", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Adjust limits", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("heading", { name: /^No hours match/ }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("bad thresholds are explained without saving broken preferences", async ({
  page,
}) => {
  await select(page);
  await page.getByRole("spinbutton", { name: /^Minimum/ }).fill("90");
  await expect(page.locator(".desktop-limits [role=alert]")).toContainText(
    "Minimum temperature",
  );
  await expect(page.locator(".hour-card")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("spinbutton", { name: /^Minimum/ })).toHaveValue(
    "55",
  );
});
test("missing and outside-limit timeline hours expose their measurements", async ({
  page,
}) => {
  await select(page);
  await page.locator(".timeline-track button.unavailable").click();
  await expect(page.getByRole("dialog")).toContainText("Wind unavailable");
  await page.getByRole("button", { name: "Close hour conditions" }).click();
});
test("loading state gives feedback and responds after service completion", async ({
  page,
}) => {
  await page.route("https://api.open-meteo.com/**", async (r) => {
    await new Promise((res) => setTimeout(res, 500));
    await r.fulfill({ json: response });
  });
  await page.getByRole("searchbox", { name: "City", exact: true }).fill("Den");
  await page.getByRole("button", { name: /Denver.*Colorado/ }).click();
  await expect(
    page.getByRole("heading", { name: "Loading forecast", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".hour-card")).toHaveCount(9);
});
