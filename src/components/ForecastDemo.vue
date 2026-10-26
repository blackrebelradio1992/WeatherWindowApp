<script setup lang="ts">
import { ref } from "vue";
import type { Forecast } from "../types";
import { getForecast } from "../services/api";
import { useRequest } from "../useRequest";
import HourTable from "./HourTable.vue";
const lat = ref(41.85);
const lon = ref(-87.65);
const data = ref<Forecast | null>(null);
const { state, error, run, cancel } = useRequest();
function fetchForecast() {
  data.value = null;
  void run(
    (s) => getForecast(lat.value, lon.value, s),
    (r) => (data.value = r),
  );
}
</script>
<template>
  <section id="forecast">
    <h2>03 / Forecast retrieval</h2>
    <p>
      Independent request using manually entered coordinates. The API returns 48
      hourly slots starting with the current hour.
    </p>
    <form @submit.prevent="fetchForecast">
      <label
        >Latitude<input type="number" step="any" v-model.number="lat" /></label
      ><label
        >Longitude<input type="number" step="any" v-model.number="lon" /></label
      ><button>Fetch forecast</button
      ><button type="button" @click="cancel" :disabled="state !== 'Loading'">
        Cancel forecast
      </button>
    </form>
    <p role="status">Forecast request: {{ state }}</p>
    <p v-if="error" role="alert">
      {{ error }} <button @click="fetchForecast">Retry forecast</button>
    </p>
    <template v-if="data"
      ><p>
        {{ data.hours.length }} records · Timezone: {{ data.timezone }} ·
        Retrieved {{ data.fetchedAt }}
      </p>
      <HourTable :hours="data.hours" :timezone="data.timezone"
    /></template>
  </section>
</template>
