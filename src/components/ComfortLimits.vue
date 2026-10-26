<script setup lang="ts">
import { computed, useId } from "vue";
import type { Limits } from "../types";
import type { Unit } from "../utils/weather";
import { toDisplay, toFahrenheit } from "../utils/weather";
import { validateLimits } from "../utils/filterHours";
const prefix = useId();
const props = defineProps<{ limits: Limits; unit: Unit; count: number }>();
const emit = defineEmits<{
  change: [key: keyof Limits, value: number];
  unit: [Unit];
}>();
const min = computed(() => toDisplay(props.limits.minTemp, props.unit));
const max = computed(() => toDisplay(props.limits.maxTemp, props.unit));
const error = computed(() => validateLimits(props.limits));
const rangeMin = computed(() => toDisplay(-20, props.unit));
const rangeMax = computed(() => toDisplay(120, props.unit));
function update(event: Event, key: keyof Limits, temp = false) {
  const raw = (event.target as HTMLInputElement).value;
  const n = raw.trim() === "" ? NaN : Number(raw);
  emit("change", key, temp ? toFahrenheit(n, props.unit) : n);
}
</script>
<template>
  <div class="comfort">
    <h2>Your comfort limits</h2>
    <p class="muted">All three must pass for an hour to match.</p>
    <div class="limit-group">
      <div class="label-line">
        <strong>Temperature</strong>
        <div class="unit-switch" aria-label="Temperature units">
          <button :aria-pressed="unit === 'F'" @click="emit('unit', 'F')">
            °F</button
          ><button :aria-pressed="unit === 'C'" @click="emit('unit', 'C')">
            °C
          </button>
        </div>
      </div>
      <div class="temp-inputs">
        <label
          >Minimum<input
            :value="Number.isFinite(min) ? min : ''"
            type="number"
            step="0.1"
            :aria-invalid="!!error"
            @input="update($event, 'minTemp', true)"
          /><span>°{{ unit }}</span></label
        ><label
          >Maximum<input
            :value="Number.isFinite(max) ? max : ''"
            type="number"
            step="0.1"
            :aria-invalid="!!error"
            @input="update($event, 'maxTemp', true)"
          /><span>°{{ unit }}</span></label
        >
      </div>
      <label class="sr-only" :for="prefix + '-minimum-slider'"
        >Minimum temperature slider</label
      ><input
        :id="prefix + '-minimum-slider'"
        type="range"
        :min="rangeMin"
        :max="rangeMax"
        :value="min"
        @input="update($event, 'minTemp', true)"
      /><label class="sr-only" :for="prefix + '-maximum-slider'"
        >Maximum temperature slider</label
      ><input
        :id="prefix + '-maximum-slider'"
        type="range"
        :min="rangeMin"
        :max="rangeMax"
        :value="max"
        @input="update($event, 'maxTemp', true)"
      />
      <div class="range-ends">
        <span>{{ rangeMin }}°{{ unit }}</span
        ><span>{{ rangeMax }}°{{ unit }}</span>
      </div>
    </div>
    <div class="limit-group">
      <div class="label-line">
        <label :for="prefix + '-wind-number'">Maximum wind</label>
        <div class="number-unit">
          <input
            :id="prefix + '-wind-number'"
            :value="Number.isFinite(limits.maxWind) ? limits.maxWind : ''"
            type="number"
            min="0"
            @input="update($event, 'maxWind')"
          /><span>mph</span>
        </div>
      </div>
      <input
        aria-label="Maximum wind slider"
        type="range"
        min="0"
        max="60"
        :value="limits.maxWind"
        @input="update($event, 'maxWind')"
      />
      <div class="range-ends"><span>0 mph</span><span>60 mph</span></div>
    </div>
    <div class="limit-group">
      <div class="label-line">
        <label :for="prefix + '-rain-number'">Maximum rain</label>
        <div class="number-unit">
          <input
            :id="prefix + '-rain-number'"
            :value="Number.isFinite(limits.maxRain) ? limits.maxRain : ''"
            type="number"
            min="0"
            max="100"
            @input="update($event, 'maxRain')"
          /><span>%</span>
        </div>
      </div>
      <input
        aria-label="Maximum rain slider"
        type="range"
        min="0"
        max="100"
        :value="limits.maxRain"
        @input="update($event, 'maxRain')"
      />
      <div class="range-ends"><span>0%</span><span>100%</span></div>
    </div>
    <p v-if="error" class="validation" role="alert">{{ error }}</p>
    <p class="micro limits-feedback">
      <strong>{{ error ? "Check limits" : `${count} hours match` }}</strong>
      Results update as you adjust.
    </p>
  </div>
</template>
