<script setup lang="ts">
import { ref, computed } from "vue";
const name = ref("");
const number = ref(10);
const feedback = computed(() =>
  Number.isFinite(number.value)
    ? number.value > 20
      ? "Above 20"
      : "20 or below"
    : "Enter a number",
);
</script>
<template>
  <section id="input">
    <h2>01 / Reactive input</h2>
    <p>Change an input to see Vue update the output.</p>
    <div class="controls">
      <label>Example name<input v-model="name" /></label
      ><label
        >Example limit<input v-model.number="number" type="number"
      /></label>
    </div>
    <output aria-live="polite"
      >Name: {{ name || "(empty)" }} · Value: {{ number }} ·
      {{ feedback }}</output
    ><button
      @click="
        name = '';
        number = 10;
      "
    >
      Reset inputs
    </button>
  </section>
</template>
