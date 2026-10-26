<script setup lang="ts">
import { computed } from "vue";
import { limits } from "../labState";
import { sampleHours, filterHours, validateLimits } from "../utils/filterHours";
import HourTable from "./HourTable.vue";
const error = computed(() => validateLimits(limits));
const matched = computed(() => filterHours(sampleHours, limits));
const labels = computed(
  () =>
    matched.value
      .map((h) => String.fromCharCode(65 + sampleHours.indexOf(h)))
      .join(", ") || "none",
);
</script>
<template>
  <section id="filter">
    <h2>04 / Filtering rules</h2>
    <p>
      Use the known sample records to check each rule. Limits also feed the
      integration test.
    </p>
    <div class="controls">
      <label
        >Minimum temperature °F<input
          type="number"
          v-model.number="limits.minTemp" /></label
      ><label
        >Maximum temperature °F<input
          type="number"
          v-model.number="limits.maxTemp" /></label
      ><label
        >Maximum wind mph<input
          type="number"
          min="0"
          v-model.number="limits.maxWind" /></label
      ><label
        >Maximum rain %<input
          type="number"
          min="0"
          max="100"
          v-model.number="limits.maxRain"
      /></label>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <HourTable :hours="sampleHours" timezone="UTC" sample /><output
      aria-live="polite"
      >{{ matched.length }} matching sample(s): {{ labels }}</output
    >
    <p>
      All four comparisons must pass. Missing values never match. Boundaries are
      inclusive.
    </p>
  </section>
</template>
