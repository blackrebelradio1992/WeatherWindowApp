<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import type { City } from "../types";
import { searchCities } from "../services/api";
import { useRequest } from "../useRequest";
const props = defineProps<{ recent: City[]; canCancel: boolean }>();
const emit = defineEmits<{ select: [City]; cancel: [] }>();
const query = ref("");
const results = ref<City[]>([]);
const input = ref<HTMLInputElement | null>(null);
const { state, error, run, cancel } = useRequest();
let timer: ReturnType<typeof setTimeout> | undefined;
function search() {
  clearTimeout(timer);
  if (query.value.trim().length < 2) return;
  results.value = [];
  void run(
    (s) => searchCities(query.value, s),
    (v) => (results.value = v),
  );
}
watch(query, () => {
  clearTimeout(timer);
  cancel();
  results.value = [];
  if (query.value.trim().length >= 2) timer = setTimeout(search, 350);
});
onBeforeUnmount(() => clearTimeout(timer));
nextTick(() => input.value?.focus());
</script>
<template>
  <div class="city-page">
    <p class="overline">WEATHER, WITHIN YOUR LIMITS</p>
    <h1>Find your window.</h1>
    <p class="muted intro">
      Choose a city. Set your comfort limits. Find the hours that fit.
    </p>
    <form @submit.prevent="search">
      <label for="city-query">City</label>
      <div class="search-field">
        <span aria-hidden="true">⌕</span
        ><input
          id="city-query"
          ref="input"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Search city, region, or country"
          aria-describedby="search-hint"
        /><button
          v-if="query"
          type="button"
          class="text-button"
          @click="query = ''"
        >
          Clear
        </button>
      </div>
    </form>
    <p id="search-hint" class="sr-only">
      Type at least two letters. Search results appear below.
    </p>
    <div
      class="search-results"
      aria-live="polite"
      :aria-busy="state === 'Loading'"
    >
      <template v-if="!query.trim()"
        ><p class="result-label">
          {{ props.recent.length ? "RECENTLY USED" : "GET STARTED" }}
        </p>
        <button
          v-for="c in props.recent"
          :key="c.id"
          class="city-option"
          @click="emit('select', c)"
        >
          <span aria-hidden="true">◷</span
          ><span
            ><strong>{{ c.name }}</strong
            ><small
              >{{ c.region }}{{ c.region ? ", " : "" }}{{ c.country }}</small
            ></span
          ><span aria-hidden="true">↗</span>
        </button>
        <p v-if="!props.recent.length" class="empty-search">
          Search for your city to see its next 48 forecast hours. Your recent
          choices will appear here.
        </p></template
      >
      <p v-else-if="query.trim().length < 2" class="empty-search">
        Type at least two characters.
      </p>
      <p
        v-else-if="state === 'Loading' || state === 'Cancelled'"
        class="empty-search"
        role="status"
      >
        Searching for “{{ query }}”…
      </p>
      <template v-else-if="state === 'Error'"
        ><p class="empty-search" role="alert">{{ error }}</p>
        <button class="text-button retry-search" @click="search">
          Retry city search
        </button></template
      ><template v-else-if="results.length"
        ><p class="result-label">
          CITIES <span>{{ results.length }} results</span>
        </p>
        <button
          v-for="c in results"
          :key="c.id"
          class="city-option"
          @click="emit('select', c)"
        >
          <span
            ><strong>{{ c.name }}</strong
            ><small
              >{{ c.region }}{{ c.region ? ", " : "" }}{{ c.country }}</small
            ></span
          ><span aria-hidden="true">↗</span>
        </button></template
      >
      <div v-else class="empty-search">
        <strong>No cities found for “{{ query }}”.</strong>
        <p>Check the spelling or include a region or country.</p>
      </div>
    </div>
    <p class="micro muted">
      Forecasts cover 48 hourly slots starting with the current hour. All times
      are local to your city.
    </p>
    <button v-if="canCancel" class="text-button" @click="emit('cancel')">
      Back to current forecast
    </button>
  </div>
</template>
