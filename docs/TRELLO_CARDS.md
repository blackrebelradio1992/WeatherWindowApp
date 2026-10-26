# Trello card descriptions and acceptance checklists

Start with the bulk-paste titles or the optional importer. Move a card to Done only after verifying its checklist. Weeks are relative to your project start; set actual due dates in Trello.

## Documentation and research

### [DOC-01] Project scope, links, and definition of done

Status: Planned

Keep the main app URL, /demo.html URL, GitHub URL, Trello Workspace URL, and roadmap Board URL here. One city, 48 hourly slots, three matching rules. Final release requires local review, testing, and deployment verification.

Acceptance checklist:

- [ ] Add real repository and app links
- [ ] Add Workspace and Board links
- [ ] Link docs/PROOF_OF_CONCEPT.md and README.md
- [ ] Record the current release and open limitations

### [DOC-02] Attach Assignment 4 pitch and approved scope

Status: Planned

Attach WeatherWindow pitch slides and any instructor feedback. Record the approved platform, APIs, exclusions, and changes. Do not substitute the HomeKeep pitch.

Acceptance checklist:

- [ ] Attach WeatherWindow pitch PowerPoint
- [ ] Attach approval or feedback if available
- [ ] Link prioritized final feature list

### [DOC-03] Attach Assignment 5 research artifacts

Status: Planned

Attach both feature lists, technical research report, original demo evidence, and recording link if created. The app preserves the original seven experiments at /demo.html.

Acceptance checklist:

- [ ] Attach PP4 feature list PDF
- [ ] Attach R&D feature list PDF
- [ ] Attach technical research PDF and original demo source/reference
- [ ] Link Assignment 5 recording if required and available

### [DOC-04] Attach Assignment 6 prototype and wireframes

Status: Planned

Attach Gary_Frank_Week3_ProjectPrototype.pdf, prototype share link, and supplied desktop/mobile wireframes. Static exports do not verify prototype interaction links.

Acceptance checklist:

- [ ] Attach prototype report PDF
- [ ] Link the actual prototyping tool file
- [ ] Attach desktop and mobile wireframe PDFs
- [ ] Link docs/WIREFRAME_MAP.md

### [DOC-05] Competitive UX research

Status: Planned

Research sources: AccuWeather https://apps.apple.com/us/app/accuweather-weather-forecast/id300048137 and Weather Underground https://www.wunderground.com/faqs. Borrow city selection and hourly presentation. Test the benefit of visible threshold controls and explanations without claiming competitors lack features.

Acceptance checklist:

- [ ] Link both researched products
- [ ] Attach pitch screenshots or research report
- [ ] Record borrowed conventions and proposed improvements
- [ ] Separate observations from user-test findings

### [DOC-06] Research and troubleshooting log

Status: Planned

Use docs/RESEARCH_LOG.md. Record Node path correction, API data model decisions, timezone handling, browser tests, and new resources used. Include tutorials, forum threads, and Discord links only if actually used.

Acceptance checklist:

- [ ] Link all sources actually used
- [ ] Record each problem, fix, and evidence
- [ ] Link relevant code modules
- [ ] Add instructor feedback and changes

## Technology stack

### [TECH-01] Vue 3, TypeScript, HTML, CSS, and Vite

Status: Implemented in supplied code; verify on your Mac

Vue Composition API drives UI; TypeScript models cities/hours/preferences; HTML labels and CSS implement wireframes; Vite builds independent index.html and demo.html entries. Tooling: Node.js 24, npm, VS Code, Git, GitHub.

Acceptance checklist:

- [ ] Verify node --version shows 24.x
- [ ] Run npm ci and npm run build
- [ ] Explain main.ts versus demo.ts
- [ ] Keep package-lock.json committed

### [TECH-02] Open-Meteo APIs, Fetch, and AbortController

Status: Implemented in supplied code; verify live

Geocoding maps queries to cities. Forecast API retrieves core and supporting measurements. Fetch checks HTTP status. AbortController cancels obsolete work; sequence guards ignore stale responses. No private weather API key or backend is required.

Acceptance checklist:

- [ ] Demonstrate a live city lookup
- [ ] Demonstrate a live forecast response
- [ ] Explain normalization and missing values
- [ ] Check cancellation and error feedback

### [TECH-03] localStorage and versioned persistence

Status: Implemented in supplied code; verify locally

Product key weatherwindow-preferences-v1 stores city, five recent choices, canonical Fahrenheit thresholds, and display unit. Lab uses a separate key. No server database or cross-device sync.

Acceptance checklist:

- [ ] Reload and restore last city and limits
- [ ] Verify recent-city deduplication
- [ ] Check corrupt data feedback
- [ ] Explain origin-specific storage

### [TECH-04] Vitest, Playwright, GitHub Actions, and Pages

Status: Tests and workflow supplied; hosting not performed

Vitest checks deterministic rules. Playwright tests actual UI with explicit fixtures. GitHub Actions runs unit checks and builds both pages. Pages hosting is optional until the user publishes it.

Acceptance checklist:

- [ ] Run npm test
- [ ] Install Chromium and run npm run test:e2e
- [ ] Inspect workflow output after push
- [ ] Verify both published URLs

## Week 1 — Foundation

### [W1-01] Upgrade existing lab and preserve research page

Status: Implemented in supplied code; verify update locally

Apply upgrade-weatherwindow.mjs in the existing lab root. Review the backup location. Main product loads at /; independent Demo Lab loads only by /demo.html URL, without main navigation link. URL knowledge is not authentication.

Acceptance checklist:

- [ ] Apply update once
- [ ] Verify existing backup
- [ ] Open main page and /demo.html
- [ ] Confirm no main-app Demo Lab link

### [W1-02] City type-ahead and location disambiguation

Status: Implemented in supplied code; verify locally

Debounce search, list city/region/country, allow form submission and selecting the correct city. Preserve a Back action when changing an existing city.

Acceptance checklist:

- [ ] Type Denver and distinguish results
- [ ] Check two-character minimum
- [ ] Use keyboard to select a city
- [ ] Change city and return to forecast

### [W1-03] City search loading, empty results, and failure

Status: Implemented in supplied code; verify locally

Use inline search feedback. Empty results retain the query. Failure offers Retry. Obsolete requests cannot overwrite a newer search.

Acceptance checklist:

- [ ] Observe searching state
- [ ] Try a query with no results
- [ ] Check failed request recovery
- [ ] Check newer search wins

### [W1-04] Forecast request and 48-hour data model

Status: Implemented in supplied code; verify live

Request 48 hourly slots from the current hour; specify Fahrenheit, mph, inches, Unix timestamps, and auto timezone. Preserve missing data as null.

Acceptance checklist:

- [ ] Inspect API parameters
- [ ] Check 48 records when available
- [ ] Check units and timezone
- [ ] Check missing core data excluded

### [W1-05] Create GitHub repository and invite instructor

Status: Planned

Create an empty weatherwindow repository, commit source, push main, then invite the exact instructor account CreatorRob. User must verify the account before sending invitation.

Acceptance checklist:

- [ ] Create repository
- [ ] Commit source without node_modules or secrets
- [ ] Push main and verify files
- [ ] Send CreatorRob collaborator invitation

## Week 2 — Core experience

### [W2-01] Temperature, wind, and rain controls

Status: Implemented in supplied code; verify locally

Use accessible numeric inputs and sliders. Minimum <= maximum; wind >= 0; rain 0–100. Comparisons are inclusive and all three rules must pass. Invalid edits show feedback and do not overwrite saved valid preferences.

Acceptance checklist:

- [ ] Adjust each input and slider
- [ ] Check results recalculate
- [ ] Check inclusive boundaries
- [ ] Check invalid inputs preserve saved values

### [W2-02] Fahrenheit and Celsius display conversion

Status: Implemented in supplied code; verify locally

Store and compare canonical Fahrenheit values. Convert display and entered temperature values, avoiding repeated conversion drift. Wind remains mph and precipitation remains inches.

Acceptance checklist:

- [ ] Switch F/C with same match count
- [ ] Edit Celsius temperature
- [ ] Reload Celsius preference
- [ ] Verify units beside every value

### [W2-03] Interactive 48-hour timeline

Status: Implemented in supplied code; verify locally

Render one cell per hour with match/outside/unavailable states and accessible measurement labels. A matching cell opens its row; other cells open condition details. Mobile timeline scrolls horizontally.

Acceptance checklist:

- [ ] Verify all 48 cells
- [ ] Check missing measurement styling
- [ ] Select matching and nonmatching cells
- [ ] Use keyboard to reach each cell

### [W2-04] Matching-hour rows and mobile cards

Status: Implemented in supplied code; verify locally

Show local date/time, temperature, wind, rain chance, match count, and why-it-matches chips. Desktop list scrolls vertically; mobile cards swipe horizontally.

Acceptance checklist:

- [ ] Check chronological results
- [ ] Read measurements and explanations
- [ ] Check zero-match behavior
- [ ] Compare desktop/mobile layout

### [W2-05] Expanded hour conditions and explanations

Status: Implemented in supplied code; verify live

Expand the selected hour inline. Show feels-like temperature, humidity, WMO condition text, wind direction/gusts, precipitation, and cloud cover where available. Explain core rule comparisons; missing supporting values do not change matches.

Acceptance checklist:

- [ ] Open and close a result
- [ ] Verify actual API values
- [ ] Check comparison explanations
- [ ] Check unavailable supporting values

## Week 3 — Quality and usability

### [W3-01] Forecast loading, Retry, and refresh

Status: Implemented in supplied code; verify locally

Keep city and limits through forecast failure. Show loading feedback. Retry and Refresh retrieve the same selected city again.

Acceptance checklist:

- [ ] Check loading on slow connection
- [ ] Simulate offline failure
- [ ] Retry after reconnecting
- [ ] Refresh and check retrieval time

### [W3-02] No matches and invalid limits recovery

Status: Implemented in supplied code; verify locally

Show active thresholds and guidance to widen limits. Do not invent matches or treat missing data as favorable.

Acceptance checklist:

- [ ] Set rain limit to zero
- [ ] Verify active thresholds displayed
- [ ] Widen limits and recover
- [ ] Check invalid-range message

### [W3-03] Mobile Adjust limits bottom sheet

Status: Implemented in supplied code; verify on your device

Use a native dialog for focus handling and Escape. Changes update matches. Closing returns focus to Adjust limits. Verify sheet scrolling and unique control labels.

Acceptance checklist:

- [ ] Open at 390px width
- [ ] Edit limits and close sheet
- [ ] Check Escape and focus return
- [ ] Verify no horizontal page overflow

### [W3-04] Keyboard, contrast, and screen reader review

Status: Planned

Review labels, live status feedback, tab order, focus rings, dialog behavior, and noncolor timeline labels. Automated checks do not replace manual accessibility testing.

Acceptance checklist:

- [ ] Complete flow by keyboard
- [ ] Check screen reader labels
- [ ] Check contrast and touch targets
- [ ] Record issues and fixes

### [W3-05] Timezone and data quality checks

Status: Planned

Test a city outside your local timezone and daylight-saving transitions. Dates and hour labels use the returned city timezone. Weather values can be incomplete or estimated.

Acceptance checklist:

- [ ] Compare two timezones
- [ ] Verify midnight date rollover
- [ ] Check repeated daylight-saving hour labels
- [ ] Verify missing core measurements never match

## Week 4 — Release and submission

### [W4-01] Regression and cross-browser verification

Status: Planned

Run all automated checks, then verify on intended desktop/mobile browsers. Preserve separate lab and product storage.

Acceptance checklist:

- [ ] Run unit suite
- [ ] Run browser suite
- [ ] Check both product and lab pages
- [ ] Record browsers and actual results

### [W4-02] User feedback and scope review

Status: Planned

Ask users to choose a city, find an acceptable hour, adjust limits, and explain the result. Record actual observations; do not fabricate user findings.

Acceptance checklist:

- [ ] Prepare three meaningful tasks
- [ ] Record actual feedback
- [ ] Prioritize issues
- [ ] Resolve high-impact issues

### [W4-03] Publish and verify both pages

Status: Planned

Use supplied GitHub Pages workflow if hosting is wanted. Verify main app, /demo.html, direct refresh, asset paths, live requests, and storage on deployed origin.

Acceptance checklist:

- [ ] Configure Pages GitHub Actions
- [ ] Verify successful workflow
- [ ] Open both deployed URLs
- [ ] Record deployment link

### [W4-04] Complete artifact index and instructor access

Status: Planned

Attach or link every prior artifact and research source. Invite creatorrob to the Trello Workspace and ensure Board access; GitHub collaboration invitation is separate.

Acceptance checklist:

- [ ] Attach Assignment 4/5/6 artifacts
- [ ] Verify links are accessible to instructor
- [ ] Invite creatorrob to Workspace and Board
- [ ] Confirm CreatorRob repository invitation

### [W4-05] Record the 3–5 minute showcase

Status: Planned

Student records the application, explains main modules, demonstrates meaningful API and storage work, and compares progress against the original demo. No video is supplied in this package.

Acceptance checklist:

- [ ] Demonstrate live main app
- [ ] Open /demo.html briefly
- [ ] Explain shared services and new UI
- [ ] Record voice and upload unlisted video or MP4

### [W4-06] Submit links and final verification

Status: Planned

Post GitHub repository, Trello Workspace/Board, and video links in assignment Feedback; upload MP4 instead if chosen. No account creation, invites, or submissions have been performed by the supplied code.

Acceptance checklist:

- [ ] Copy actual GitHub URL
- [ ] Copy Trello Workspace and Board URLs
- [ ] Add unlisted video URL or MP4
- [ ] Review all instructor access and submit
