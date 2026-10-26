# Wireframe implementation map

All 19 supplied desktop/mobile exports are retained in docs/wireframes. This update implements the interface in Vue as a proof of concept. It does not replace the separate prototyping-tool deliverable from the earlier assignment.

| Supplied view | Working implementation |
| --- | --- |
| City lookup recent / recently used | CitySearch.vue shows actual saved recent choices, not invented history. First use has Get started guidance. |
| City type-ahead results | Debounced Geocoding API request; region/country labels; selection opens results. |
| City inline loading | Inline searching feedback with stale-request cancellation. |
| City inline empty | Retained query and spelling/region recovery guidance. |
| Forecast loading | Product results shell with city and comfort controls retained. |
| Forecast error | Failed HTTP/network message and Retry; selected city and thresholds remain. |
| Main matching hours desktop | Limits sidebar, 48-hour timeline, count, scrollable results, refresh. |
| Main matching hours mobile | Compact summary, limits chips, horizontally scrollable timeline and hour cards. |
| Hour detail inline / expanded in place | Expand/collapse each matching result with per-rule explanation and available supporting weather measurements. |
| No matches desktop/mobile | Clear zero-match state, active limits, and recovery guidance. |
| Adjust limits bottom sheet | Native dialog, editable controls, immediate updates, Escape/Close, focus restoration. |

Functional adaptations: two independently labeled temperature sliders instead of a custom dual-thumb control; wider numeric ranges accommodate real weather; recent cities are genuinely saved; counts and conditions use live data; timeline labels use real city-local dates. Sample PDF Denver values are not hardcoded into the application.

Unimplemented/deferred scope: accounts, cloud sync, radar, notification systems, severe-weather guarantees, offline forecast cache, and automated real-user usability conclusions. The core app remains one city with three preference comparisons. Lab navigation is URL-only, not security.
