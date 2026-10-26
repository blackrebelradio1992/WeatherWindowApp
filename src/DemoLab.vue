<script setup lang="ts">
import InputDemo from "./components/InputDemo.vue";
import CityLookupDemo from "./components/CityLookupDemo.vue";
import ForecastDemo from "./components/ForecastDemo.vue";
import FilterDemo from "./components/FilterDemo.vue";
import StorageDemo from "./components/StorageDemo.vue";
import RequestDemo from "./components/RequestDemo.vue";
import IntegrationDemo from "./components/IntegrationDemo.vue";
</script>
<template>
  <a class="skip" href="#main">Skip to experiments</a>
  <header>
    <p class="eyebrow">TECHNOLOGY RESEARCH / DEMONSTRATOR</p>
    <h1>Technology Demo Lab</h1>
    <p>Seven focused experiments. One connected technology chain.</p>
    <p>Vue 3 · TypeScript · Fetch · Open-Meteo · localStorage</p>
  </header>
  <nav aria-label="Experiments">
    <a href="#input">01 Input</a><a href="#cities">02 Cities</a
    ><a href="#forecast">03 Forecast</a><a href="#filter">04 Filter</a
    ><a href="#storage">05 Storage</a><a href="#requests">06 Requests</a
    ><a href="#integration">07 Integration</a>
  </nav>
  <main id="main">
    <InputDemo /><CityLookupDemo /><ForecastDemo /><FilterDemo /><StorageDemo /><RequestDemo /><IntegrationDemo />
  </main>
  <footer>
    <p>
      Research demonstrator. Forecast data:
      <a href="https://open-meteo.com/">Open-Meteo</a> under
      <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. City
      data: GeoNames via Open-Meteo. Live requests need an internet connection.
      No API key is embedded.
    </p>
  </footer>
</template>
