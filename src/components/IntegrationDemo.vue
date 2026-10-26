<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { selectedCity, limits } from "../labState";
import { getForecast } from "../services/api";
import { filterHours, validateLimits } from "../utils/filterHours";
import type { Forecast } from "../types";
import { useRequest } from "../useRequest";
import HourTable from "./HourTable.vue";
const data = ref<Forecast | null>(null);
const cityName = ref("");
const { state, error, run, cancel } = useRequest();
const matched = computed(() =>
  data.value ? filterHours(data.value.hours, limits) : [],
);
const invalid = computed(() => validateLimits(limits));
watch(selectedCity, () => {
  cancel();
  data.value = null;
});
function integrate() {
  data.value = null;
  const city = selectedCity.value;
  if (!city || invalid.value) return;
  cityName.value = city.name;
  void run(
    (s) => getForecast(city.latitude, city.longitude, s),
    (r) => (data.value = r),
  );
}
</script>
<template>
  <section id="integration">
    <h2>07 / Integrated technology test</h2>
    <p>
      Shared city coordinates feed the forecast API. Current limits filter its
      response. Save and reload through Demo 5 to repeat the chain.
    </p>
    <p>
      City:
      {{
        selectedCity?.name ??
        "Select a city in Demo 2 or load saved preferences."
      }}
    </p>
    <p v-if="invalid" role="alert">{{ invalid }}</p>
    <button @click="integrate" :disabled="!selectedCity || !!invalid">
      Run integration test</button
    ><button @click="cancel" :disabled="state !== 'Loading'">
      Cancel integration
    </button>
    <p role="status">Integration: {{ state }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <template v-if="data"
      ><output
        >{{ cityName }}: {{ matched.length }} of {{ data.hours.length }} hours
        match all limits.</output
      >
      <p>
        Timezone: {{ data.timezone }} · Retrieved {{ data.fetchedAt }}. Matches
        are preference comparisons, not safety advice.
      </p>
      <HourTable :hours="matched" :timezone="data.timezone"
    /></template>
  </section>
</template>
