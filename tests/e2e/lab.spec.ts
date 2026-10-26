import { test, expect } from "@playwright/test";
const city = {
  id: 4887398,
  name: "Chicago",
  admin1: "Illinois",
  country: "United States",
  latitude: 41.85,
  longitude: -87.65,
  timezone: "America/Chicago",
};
const forecast = {
  timezone: "America/Chicago",
  hourly: {
    time: [1792717200, 1792720800],
    temperature_2m: [65, 85],
    wind_speed_10m: [5, 5],
    precipitation_probability: [10, 10],
  },
};
test.beforeEach(async ({ page }) => {
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ json: { results: [city] } }),
  );
  await page.route("https://api.open-meteo.com/**", (r) =>
    r.fulfill({ json: forecast }),
  );
  await page.goto("/demo.html");
});
test("separate experiments connect through API results and saved preferences", async ({
  page,
}) => {
  await page.getByLabel("Example name", { exact: true }).fill("Demo");
  await expect(page.locator("#input output")).toContainText("Demo");
  await page
    .getByRole("button", { name: "Search cities", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Select Chicago", exact: true })
    .click();
  await expect(page.locator("#cities output")).toContainText("41.85");
  await expect(page.locator("#filter output")).toContainText(
    "1 matching sample(s): A",
  );
  await page
    .getByRole("button", { name: "Save preferences", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("button", { name: "Load preferences", exact: true })
    .click();
  await expect(page.locator("#storage")).toContainText(
    "Restored city and limits.",
  );
  await page
    .getByRole("button", { name: "Run integration test", exact: true })
    .click();
  await expect(page.locator("#integration output")).toContainText(
    "1 of 2 hours match",
  );
  await page
    .getByRole("button", { name: "Clear saved data", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("button", { name: "Load preferences", exact: true })
    .click();
  await expect(page.locator("#storage")).toContainText("No saved data.");
});
test("manual forecast and invalid limits", async ({ page }) => {
  await page
    .getByRole("button", { name: "Fetch forecast", exact: true })
    .click();
  await expect(page.locator("#forecast")).toContainText("2 records");
  await page.getByLabel("Minimum temperature °F", { exact: true }).fill("90");
  await expect(page.locator("#filter [role=alert]")).toContainText(
    "Minimum temperature",
  );
});
test("controlled cancellation, failure, and retry", async ({ page }) => {
  await page
    .getByRole("button", { name: "Start delayed success", exact: true })
    .click();
  await expect(page.locator("#requests [role=status]")).toContainText(
    "Loading",
  );
  await page
    .getByRole("button", { name: "Cancel experiment", exact: true })
    .click();
  await expect(page.locator("#requests [role=status]")).toContainText(
    "Cancelled",
  );
  await page
    .getByRole("button", { name: "Start controlled failure", exact: true })
    .click();
  await expect(page.locator("#requests [role=alert]")).toContainText(
    "Controlled example failure",
  );
  await page
    .getByRole("button", { name: "Retry success", exact: true })
    .click();
  await expect(page.locator("#requests output")).toContainText("completed");
});
test("live-request errors remain visible and recoverable", async ({ page }) => {
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ status: 503, json: {} }),
  );
  await page
    .getByRole("button", { name: "Search cities", exact: true })
    .click();
  await expect(page.locator("#cities [role=alert]")).toContainText("503");
  await page.route("https://geocoding-api.open-meteo.com/**", (r) =>
    r.fulfill({ json: { results: [] } }),
  );
  await page
    .getByRole("button", { name: "Retry city search", exact: true })
    .click();
  await expect(page.locator("#cities")).toContainText("No cities found.");
});
test("corrupt saved data gives feedback", async ({ page }) => {
  await page.evaluate(() =>
    localStorage.setItem("technology-demo-lab-preferences", "{"),
  );
  await page
    .getByRole("button", { name: "Load preferences", exact: true })
    .click();
  await expect(page.locator("#storage")).toContainText("Storage error");
});
test("newer city request wins over an older request", async ({ page }) => {
  await page.route("https://geocoding-api.open-meteo.com/**", async (r) => {
    const q = new URL(r.request().url()).searchParams.get("name");
    if (q === "Chicago") await new Promise((res) => setTimeout(res, 700));
    await r
      .fulfill({
        json: {
          results:
            q === "Paris" ? [{ ...city, id: 2988507, name: "Paris" }] : [city],
        },
      })
      .catch(() => {});
  });
  await page
    .getByRole("button", { name: "Search cities", exact: true })
    .click();
  await page.getByLabel("City name", { exact: true }).fill("Paris");
  await page
    .getByRole("button", { name: "Search cities", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Select Paris", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(800);
  await expect(
    page.getByRole("button", { name: "Select Chicago", exact: true }),
  ).toHaveCount(0);
});
