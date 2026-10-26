# WeatherWindow

A Vue 3 + TypeScript proof of concept implementing the supplied WeatherWindow wireframes with live Open-Meteo data. The original Technology Demo Lab remains an independent page.

## Run in your existing lab folder

Use Node 24 LTS. In VS Code open the folder containing package.json, then run one command at a time:

```bash
node --version
npm ci
npm run dev
```

Open the exact local URL printed by Vite. That is the main WeatherWindow app. Append `demo.html` to the same base URL for the lab, for example `http://127.0.0.1:5173/demo.html`. No link to the lab appears in the main app. This is URL-only navigation, not password protection or access control.

The main app starts with city search; once a city is saved it restores the last city and fetches a fresh forecast. To see search again, choose Change. Use a real city, then adjust temperature, wind, and rain preferences. Unit switching preserves canonical Fahrenheit comparison values. Recent city history is based on your actual selections.

The product and lab use different localStorage keys. Lab preferences cannot overwrite product preferences. The old app is preserved in src/DemoLab.vue, with independent demo.ts and lab.css entry files. A multi-page Vite build produces index.html and demo.html, so direct URLs work on GitHub Pages without history-routing rewrites.

## What works

- Debounced city search and disambiguation with region/country, recent choices, loading, empty results, and retry.
- Live forecast request for 48 hourly slots starting with the current hour.
- Validated numeric and slider controls for minimum/maximum temperature, wind speed, and rain probability.
- Fahrenheit/Celsius display and input conversion, with mph wind and inches precipitation.
- Match count and accessible timeline states for matching, outside-limit, and unavailable hours.
- Chronological matching rows, mobile swipe cards, and an Adjust limits bottom-sheet dialog.
- Expanded comparisons and supporting weather fields where available.
- Automatic saving/restoring of city, unit, valid limits, and up to five recent cities.
- Forecast loading, failure with retained preferences, Retry, and Refresh.
- Preserved seven-experiment Demo Lab at /demo.html.

No private weather API key, login, sensor, server database, or paid weather plan is needed for a noncommercial prototype under the provider terms. Optional Trello automation uses your separate local Trello key/token only; those credentials never go into the app.

## Verification commands

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected prepared results: 34 unit tests and 14 browser scenarios. The browser tests use explicit fixtures, not a live forecast guarantee. Run them on your Mac after updating. Tests cover the original six lab workflows plus eight product workflows. Production output includes both HTML pages. To inspect the built app use `npm run preview` and the URL printed by that command.

## Modules and code walkthrough

- src/main.ts + src/App.vue: product entry and composition of city, limits, timeline, states, and results.
- src/demo.ts + src/DemoLab.vue: independent original research page.
- src/useWeather.ts: shared product state, persistence, restore, forecast refresh, and matching computed values.
- src/services/api.ts: Fetch, query parameters, response normalization, missing optional fields.
- src/useRequest.ts: AbortController and request sequence protection.
- src/components/CitySearch.vue: debounced type-ahead, recents, error/empty/searching UI.
- src/components/ComfortLimits.vue: numeric inputs, sliders, validation, unit conversion.
- src/components/ForecastTimeline.vue: per-hour status, accessible labels, time navigation.
- src/components/HourDetails.vue: per-rule explanations and optional supporting conditions.
- src/utils/filterHours.ts: reusable inclusive matching logic from the lab.
- src/utils/weather.ts: unit conversion, timezone labels, status, and condition/direction labels.
- src/utils/productStorage.ts: product schema and recent-city deduplication; lab storage remains in storage.ts.
- src/weather.css and src/lab.css: independent style sheets.
- vite.config.ts: two HTML entry points and relative production assets.
- tests/core.test.ts + tests/product.test.ts: logic/data checks.
- tests/e2e/lab.spec.ts + tests/e2e/weather.spec.ts: UI workflows.

## Guides and roadmap

Start with docs/STEP_BY_STEP.md. Trello shortcuts: docs/TRELLO_BULK_PASTE.txt for built-in multi-card paste, docs/TRELLO_CARDS.md for descriptions/checklists, and optional `node tools/create-trello-roadmap.mjs --plan` to preview the automated importer. Nothing is created remotely until you explicitly run --apply, authorize locally, choose your Workspace, and confirm.

The supplied GitHub Actions workflow runs tests and builds both pages for GitHub Pages. A GitHub repository, Trello Workspace/Board, publication, invitations, attachments, and video submission have NOT been created by this code package. The guide gives steps to complete them yourself. All 19 supplied wireframes are included under docs/wireframes. Other past assignment artifacts must be attached or linked using docs/artifacts/README.md.

## Boundaries

The wireframes contain illustrative Denver results. The app uses real forecasts, so counts and conditions vary. Empty results are valid. Missing core measurements never pass. Optional missing values read Unavailable. The timeline uses the city's timezone and the first slot can include the already elapsed portion of the current hour. Recent cities appear only after actual use. Existing lab state remains independent. URL-only lab access is not authentication. Broader usability and accessibility review and production hosting checks remain planned roadmap items.
# WeatherWindowApp
