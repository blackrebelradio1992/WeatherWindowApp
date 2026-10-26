# WeatherWindow proof of concept

## Outcome

The main product interface now connects the supplied wireframe layouts to the shared research services. The old seven-experiment demo remains at demo.html with independent styling and storage. The production build emits two real HTML pages. There is no new router dependency.

## Meaningful technology chain

CitySearch captures user input, calls Open-Meteo Geocoding, and emits a typed City. useWeather passes its coordinates into the Forecast service. The service specifies units and converts parallel response arrays to Hour objects. filterHours applies the shared canonical limits. The resulting list, count, timeline, and hour details update reactively. productStorage persists the selected city, recent history, display unit, and validated preferences in localStorage. AbortController plus request sequence guards prevent stale responses from winning.

## Progress beyond the original lab

- Integrated city-to-results workflow instead of isolated experiments.
- Desktop sidebar and mobile bottom-sheet layouts based on supplied wireframes.
- Type-ahead search with recent-city history and recovery states.
- Automatic restore and refreshed forecast on a later visit.
- F/C conversion without replacing canonical threshold values.
- Interactive timeline and detailed, per-rule explanations.
- Supporting actual forecast fields, not illustrative hardcoded detail values.
- Production entry points for both product and research pages.

## Verification

See unit-test-results.txt, browser-test-results.txt, build-results.txt, and live response evidence. Expected local checks: 34 Vitest tests, 14 Playwright scenarios, and a successful multi-page Vite build. Playwright routes explicitly mock external data; real API response checks are separate. Manual desktop/mobile inspection found no page errors or horizontal page overflow at 390px in the inspected state. These checks do not establish production uptime, full accessibility compliance, or real-user usability outcomes.

## Rubric evidence and remaining student actions

| Requirement | Supplied foundation | Action still needed |
| --- | --- | --- |
| Proof of concept | Working integrated product, preserved lab, tests, source docs | Apply update and verify on your Mac |
| GitHub | Ignore rules, README, tests, deployment workflow, instructions | Create/push repo and invite CreatorRob |
| Trello | 31 detailed cards, native-checklist importer, bulk-paste titles, artifact index | Create Workspace/Board, attach prior artifacts, invite creatorrob |
| Prior artifacts | 19 supplied wireframes bundled; explicit artifact cards | Add or link Assignment 4/5/6 reports, pitch, prototype link, and actual resources |
| Showcase | Module walkthrough in README and functionality checklist | Record your own 3–5 minute video and submit links/MP4 |

No repository, hosted site, Trello board, invitation, or assignment submission is claimed to have been created. The optional importer is local source you authorize and execute against your own account.
