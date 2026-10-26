<script setup lang="ts">
import { ref } from "vue";
import type { City } from "../types";
import { selectedCity } from "../labState";
import { searchCities } from "../services/api";
import { useRequest } from "../useRequest";
const query = ref("Chicago");
const results = ref<City[]>([]);
const { state, error, run, cancel } = useRequest();
function search() {
  results.value = [];
  void run(
    (s) => searchCities(query.value, s),
    (r) => (results.value = r),
  );
}
</script>
<template>
  <section id="cities">
    <h2>02 / City lookup</h2>
    <p>
      Live geocoding experiment. Select a result to pass its coordinates to Demo
      7.
    </p>
    <form @submit.prevent="search">
      <label>City name<input v-model="query" /></label
      ><button>Search cities</button
      ><button type="button" @click="cancel" :disabled="state !== 'Loading'">
        Cancel city request
      </button>
    </form>
    <p role="status">City request: {{ state }}</p>
    <p v-if="error" role="alert">
      {{ error }} <button @click="search">Retry city search</button>
    </p>
    <p v-if="state === 'Success' && !results.length">No cities found.</p>
    <ul class="results">
      <li v-for="c in results" :key="c.id">
        <span>{{ c.name }}, {{ c.region }}, {{ c.country }}</span
        ><button @click="selectedCity = c">Select {{ c.name }}</button>
      </li>
    </ul>
    <output v-if="selectedCity"
      >Selected: {{ selectedCity.name }} · {{ selectedCity.latitude }},
      {{ selectedCity.longitude }} · {{ selectedCity.timezone }}</output
    >
  </section>
</template>
