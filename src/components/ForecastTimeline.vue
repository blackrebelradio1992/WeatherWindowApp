<script setup lang="ts">
import type { Hour, Limits } from "../types";
import type { Unit } from "../utils/weather";
import { hourStatus, timeLabel, dateLabel, toDisplay } from "../utils/weather";
defineProps<{ hours: Hour[]; limits: Limits; timezone: string; unit: Unit }>();
const emit = defineEmits<{ select: [Hour] }>();
function description(h: Hour, l: Limits, z: string, u: Unit) {
  const status = hourStatus(h, l);
  return `${dateLabel(h.time, z)}, ${timeLabel(h.time, z)}: ${status === "match" ? "matches" : status === "outside" ? "outside limits" : "unavailable"}. Temperature ${h.temperature === null ? "unavailable" : toDisplay(h.temperature, u) + "°" + u}, wind ${h.wind ?? "unavailable"} mph, rain ${h.rain ?? "unavailable"} percent.`;
}
</script>
<template>
  <section class="timeline-panel panel">
    <div class="panel-heading">
      <h2>The next 48 hours</h2>
      <div class="legend">
        <span><i class="match"></i>Matches</span
        ><span><i class="outside"></i>Outside limits</span
        ><span><i class="unavailable"></i>Unavailable</span>
      </div>
    </div>
    <p class="mobile-only micro muted">Swipe to explore →</p>
    <div
      class="timeline-scroll"
      tabindex="0"
      aria-label="48-hour forecast timeline"
    >
      <div class="timeline-track">
        <div v-for="(h, i) in hours" :key="h.time" class="hour-cell">
          <span
            class="day-label"
            v-if="
              i === 0 ||
              dateLabel(h.time, timezone) !==
                dateLabel(hours[i - 1]!.time, timezone)
            "
            >{{ dateLabel(h.time, timezone) }}</span
          ><span v-else class="day-label" aria-hidden="true">&nbsp;</span
          ><button
            :class="hourStatus(h, limits)"
            :aria-label="description(h, limits, timezone, unit)"
            :title="description(h, limits, timezone, unit)"
            @click="emit('select', h)"
          >
            {{ hourStatus(h, limits) === "unavailable" ? "–" : ""
            }}<span class="sr-only">{{
              timeLabel(h.time, timezone)
            }}</span></button
          ><span class="cell-time">{{ timeLabel(h.time, timezone) }}</span>
        </div>
      </div>
    </div>
    <p class="micro muted">
      1 cell = 1 hour. Select an hour for its conditions. Missing core
      measurements are excluded from matches.
    </p>
  </section>
</template>
