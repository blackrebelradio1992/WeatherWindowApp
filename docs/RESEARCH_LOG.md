# Research and troubleshooting log

## Evidence from this update

- Reused Vue/TypeScript, the API service, comparison rules, request lifecycle controller, and lab components.
- Chose two Vite HTML entry points so /demo.html is independently addressable on static hosting without SPA history-routing fallbacks.
- Kept product localStorage separate from lab preferences.
- Kept Fahrenheit canonical while converting temperature display/input values, so switching units alone preserves match results.
- Mapped optional forecast arrays to nullable supporting fields; only temperature, wind, and rain probability determine matches.
- Replaced an overridden heading role with aria-live so the primary heading retains its heading semantics and remains announceable.
- Checked native-dialog focus return and mobile horizontal overflow with browser tests.
- User environment issue previously observed: Homebrew Node 20 shadowed an installed Node 24; /usr/local/bin precedence selected the supported runtime.

## Primary resources used

Vue quick start: https://vuejs.org/guide/quick-start.html
Open-Meteo Forecast API: https://open-meteo.com/en/docs
Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
Open-Meteo terms: https://open-meteo.com/en/terms
Vite multi-page builds: https://vite.dev/guide/build#multi-page-app
Vite GitHub Pages: https://vite.dev/guide/static-deploy
Trello bulk paste: https://support.atlassian.com/trello/docs/importing-data-into-trello/
Trello API authorization: https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/
Trello REST board endpoints: https://developer.atlassian.com/cloud/trello/rest/api-group-boards/
GitHub collaboration: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository

No Discord participation, forum use, or real-user testing is asserted. Add only resources and observations you actually use.

## Add your local findings

For each later issue record: date, observed behavior, reproduction steps, source consulted, change made, and verification result. Attach the relevant evidence to Trello DOC-06 and link the affected feature card.
