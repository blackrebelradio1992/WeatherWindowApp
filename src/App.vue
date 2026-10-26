<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useWeather } from "./useWeather";
import { toDisplay, timeLabel, dateLabel, hourStatus } from "./utils/weather";
import type { Hour } from "./types";
import CitySearch from "./components/CitySearch.vue";
import ComfortLimits from "./components/ComfortLimits.vue";
import ForecastTimeline from "./components/ForecastTimeline.vue";
import HourDetails from "./components/HourDetails.vue";
const {
  city,
  recent,
  limits,
  unit,
  view,
  data,
  expanded,
  notice,
  validation,
  matched,
  state,
  error,
  selectCity,
  changeCity,
  cancelChange,
  refresh,
} = useWeather();
const sheetOpen = ref(false);
const sheet = ref<HTMLDialogElement | null>(null);
const adjust = ref<HTMLButtonElement | null>(null);
const selectedHour = ref<Hour | null>(null);
const detailDialog = ref<HTMLDialogElement | null>(null);
function closeSheet() {
  sheet.value?.close();
  sheetOpen.value = false;
  adjust.value?.focus();
}
async function selectHour(h: Hour) {
  if (hourStatus(h, limits) === "match") {
    expanded.value = h.time;
    await nextTick();
    document
      .getElementById("result-" + h.time)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    selectedHour.value = h;
    detailDialog.value?.showModal();
  }
}
watch(view, () => {
  sheet.value?.close();
  detailDialog.value?.close();
});
function resize() {
  if (innerWidth > 760) sheet.value?.close();
}
onMounted(() => addEventListener("resize", resize));
onBeforeUnmount(() => removeEventListener("resize", resize));
</script>
<template>
  <a class="skip" href="#content">Skip to content</a>
  <header class="site-header">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">▥</span>WeatherWindow
    </div>
    <p>A little time outside, within your limits.</p>
  </header>
  <main id="content">
    <p v-if="notice" class="storage-notice" role="status">{{ notice }}</p>
    <CitySearch
      v-if="view === 'lookup'"
      :recent="recent"
      :can-cancel="!!city"
      @select="selectCity"
      @cancel="cancelChange"
    /><template v-else-if="city"
      ><div class="weather-layout">
        <aside class="sidebar">
          <div class="city-panel panel">
            <span class="overline">YOUR CITY</span>
            <div class="label-line">
              <h2>
                {{ city.name }}{{ city.region ? ", " + city.region : "" }}
              </h2>
              <button class="text-button" @click="changeCity">Change</button>
            </div>
            <p class="muted micro">
              {{ city.country }} · {{ data?.timezone ?? city.timezone }}
            </p>
          </div>
          <div class="desktop-limits panel">
            <ComfortLimits
              :limits="limits"
              :unit="unit"
              :count="matched.length"
              @change="(key, value) => (limits[key] = value)"
              @unit="unit = $event"
            />
          </div>
        </aside>
        <div class="forecast-main">
          <div class="mobile-city mobile-only">
            <strong
              >{{ city.name
              }}{{ city.region ? ", " + city.region : "" }}</strong
            ><button class="text-button" @click="changeCity">
              Change city
            </button>
          </div>
          <div class="summary-line">
            <h1 aria-live="polite">
              <span class="desktop-only">{{
                state === "Loading"
                  ? "Finding your matching hours…"
                  : state === "Error"
                    ? "Forecast unavailable"
                    : validation
                      ? "Check your comfort limits"
                      : matched.length
                        ? `${matched.length} matching hours in the next 48 hours`
                        : "No hours match your limits in the next 48 hours."
              }}</span
              ><span class="mobile-only">{{
                state === "Loading"
                  ? "Loading forecast"
                  : state === "Error"
                    ? "Forecast unavailable"
                    : validation
                      ? "Check limits"
                      : matched.length
                        ? `${matched.length} hours match`
                        : "No hours match"
              }}</span>
            </h1>
            <button
              ref="adjust"
              class="outline-button mobile-only"
              @click="
                sheetOpen = true;
                sheet?.showModal();
              "
            >
              Adjust limits
            </button>
          </div>
          <p class="muted desktop-range" v-if="data?.hours.length">
            {{ city.name }} ·
            {{ dateLabel(data.hours[0]!.time, data.timezone) }},
            {{ timeLabel(data.hours[0]!.time, data.timezone) }} –
            {{ dateLabel(data.hours.at(-1)!.time, data.timezone) }},
            {{ timeLabel(data.hours.at(-1)!.time, data.timezone) }}
          </p>
          <div class="limit-chips mobile-only">
            <span
              >{{ toDisplay(limits.minTemp, unit) }}–{{
                toDisplay(limits.maxTemp, unit)
              }}°{{ unit }}</span
            ><span>Wind ≤ {{ limits.maxWind }} mph</span
            ><span>Rain ≤ {{ limits.maxRain }}%</span>
          </div>
          <div
            v-if="state === 'Loading'"
            class="panel status-panel"
            aria-busy="true"
          >
            <span class="spinner" aria-hidden="true"></span>
            <h2>Loading forecast</h2>
            <p>Getting the latest forecast for {{ city.name }}…</p>
          </div>
          <div
            v-else-if="state === 'Error'"
            class="panel status-panel"
            role="alert"
          >
            <h2>We couldn’t load the forecast.</h2>
            <p>{{ error }}</p>
            <p>Your city and comfort limits are still here.</p>
            <button class="primary-button" @click="refresh">
              Retry forecast
            </button>
          </div>
          <template v-else-if="data"
            ><ForecastTimeline
              :hours="data.hours"
              :limits="limits"
              :timezone="data.timezone"
              :unit="unit"
              @select="selectHour"
            />
            <p v-if="validation" class="validation" role="alert">
              {{ validation }}
            </p>
            <section class="results-panel panel">
              <div class="panel-heading">
                <h2>Matching hours</h2>
                <span class="muted micro"
                  >{{ matched.length }} hours · {{ data.timezone }}</span
                >
              </div>
              <div v-if="!matched.length" class="no-matches">
                <h2>
                  {{
                    validation
                      ? "Update your limits to continue"
                      : "No hours match your limits in the next 48 hours"
                  }}
                </h2>
                <p>
                  {{
                    validation ||
                    "Try widening your temperature range or increasing wind and rain limits."
                  }}
                </p>
                <dl>
                  <dt>Temperature</dt>
                  <dd>
                    {{ toDisplay(limits.minTemp, unit) }}–{{
                      toDisplay(limits.maxTemp, unit)
                    }}°{{ unit }}
                  </dd>
                  <dt>Maximum wind</dt>
                  <dd>{{ limits.maxWind }} mph</dd>
                  <dt>Maximum rain</dt>
                  <dd>{{ limits.maxRain }}%</dd>
                </dl>
                <p class="micro muted">
                  Hours with unavailable temperature, wind, or rain probability
                  are excluded.
                </p>
              </div>
              <template v-else
                ><div class="result-head desktop-only">
                  <span>DAY / LOCAL TIME</span><span>TEMP</span><span>WIND</span
                  ><span>RAIN</span><span></span>
                </div>
                <div class="hour-list">
                  <article
                    v-for="h in matched"
                    :key="h.time"
                    :id="'result-' + h.time"
                    class="hour-card"
                  >
                    <button
                      class="hour-summary"
                      :aria-expanded="expanded === h.time"
                      :aria-controls="'detail-' + h.time"
                      @click="expanded = expanded === h.time ? null : h.time"
                    >
                      <span class="hour-date"
                        ><span>{{ dateLabel(h.time, data.timezone) }}</span
                        ><strong>{{
                          timeLabel(h.time, data.timezone)
                        }}</strong></span
                      ><span class="measurement"
                        ><strong
                          >{{ toDisplay(h.temperature!, unit) }}°{{
                            unit
                          }}</strong
                        ><small>Temperature</small></span
                      ><span class="measurement"
                        ><strong>{{ h.wind }} mph</strong
                        ><small>Wind</small></span
                      ><span class="measurement"
                        ><strong>{{ h.rain }}%</strong
                        ><small>Rain chance</small></span
                      ><span class="chevron" aria-hidden="true">{{
                        expanded === h.time ? "⌃" : "⌄"
                      }}</span>
                    </button>
                    <div class="match-explanation">
                      <span class="desktop-only">Why it matches</span
                      ><span
                        >✓ {{ toDisplay(h.temperature!, unit) }}°{{
                          unit
                        }}</span
                      ><span>✓ {{ h.wind }} mph</span
                      ><span>✓ {{ h.rain }}% rain</span>
                    </div>
                    <p class="mobile-only micro muted card-caption">
                      All three conditions are within your limits.
                    </p>
                    <HourDetails
                      v-if="expanded === h.time"
                      :id="'detail-' + h.time"
                      :hour="h"
                      :limits="limits"
                      :unit="unit"
                      :timezone="data.timezone"
                    />
                  </article></div
              ></template>
            </section>
            <div class="refresh-line">
              <span class="micro muted"
                >Retrieved {{ new Date(data.fetchedAt).toLocaleTimeString() }} ·
                48 slots begin with the current hour.</span
              ><button class="text-button" @click="refresh">
                Refresh forecast
              </button>
            </div></template
          >
        </div>
      </div>
      <dialog
        ref="sheet"
        class="limits-sheet"
        @close="sheetOpen = false"
        @click="
          (event) => {
            if (event.target === sheet) closeSheet();
          }
        "
      >
        <div class="sheet-heading">
          <h2>Adjust limits</h2>
          <button
            aria-label="Close limits"
            class="text-button"
            @click="closeSheet"
          >
            ✕
          </button>
        </div>
        <ComfortLimits
          v-if="sheetOpen"
          :limits="limits"
          :unit="unit"
          :count="matched.length"
          @change="(key, value) => (limits[key] = value)"
          @unit="unit = $event"
        />
      </dialog>
      <dialog ref="detailDialog" class="detail-dialog">
        <div class="sheet-heading">
          <h2>Hour conditions</h2>
          <button
            class="text-button"
            aria-label="Close hour conditions"
            @click="detailDialog?.close()"
          >
            ✕
          </button>
        </div>
        <HourDetails
          v-if="selectedHour && data"
          :hour="selectedHour"
          :limits="limits"
          :unit="unit"
          :timezone="data.timezone"
        /></dialog
    ></template>
  </main>
  <footer class="site-footer">
    Weather data by <a href="https://open-meteo.com/">Open-Meteo</a> (<a
      href="https://creativecommons.org/licenses/by/4.0/"
      >CC BY 4.0</a
    >); city data from GeoNames.
    <span v-if="data">Times shown in {{ data.timezone }}.</span> Forecasts are
    not a guarantee of safe conditions.
  </footer>
</template>
