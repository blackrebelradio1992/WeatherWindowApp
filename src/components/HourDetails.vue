<script setup lang="ts">
import type { Hour, Limits } from "../types";
import type { Unit } from "../utils/weather";
import {
  toDisplay,
  timeLabel,
  dateLabel,
  weatherName,
  windDirection,
} from "../utils/weather";
defineProps<{ hour: Hour; limits: Limits; unit: Unit; timezone: string }>();
</script>
<template>
  <div class="hour-detail">
    <div>
      <p class="micro muted">
        {{ dateLabel(hour.time, timezone) }} ·
        {{ timeLabel(hour.time, timezone) }}
      </p>
      <h3>{{ weatherName(hour.weatherCode) }}</h3>
      <p class="muted">
        Feels like
        {{
          hour.feelsLike == null
            ? "unavailable"
            : toDisplay(hour.feelsLike, unit) + "°" + unit
        }}
        · Humidity {{ hour.humidity ?? "unavailable"
        }}{{ hour.humidity == null ? "" : "%" }}
      </p>
      <p class="muted">
        Wind {{ windDirection(hour.windDirection) }} · Gusts
        {{ hour.gusts ?? "unavailable" }} mph<br />Precipitation
        {{ hour.precipitation ?? "unavailable" }} in · Cloud cover
        {{ hour.cloud ?? "unavailable" }}{{ hour.cloud == null ? "" : "%" }}
      </p>
    </div>
    <div>
      <h3>How this hour compares</h3>
      <ul class="comparison">
        <li>
          {{
            hour.temperature === null
              ? "— Temperature unavailable"
              : `${hour.temperature >= limits.minTemp && hour.temperature <= limits.maxTemp ? "✓" : "×"} ${toDisplay(hour.temperature, unit)}°${unit} compared with ${toDisplay(limits.minTemp, unit)}–${toDisplay(limits.maxTemp, unit)}°${unit}`
          }}
        </li>
        <li>
          {{
            hour.wind === null
              ? "— Wind unavailable"
              : `${hour.wind <= limits.maxWind ? "✓" : "×"} ${hour.wind} mph compared with maximum ${limits.maxWind} mph`
          }}
        </li>
        <li>
          {{
            hour.rain === null
              ? "— Rain probability unavailable"
              : `${hour.rain <= limits.maxRain ? "✓" : "×"} ${hour.rain}% rain compared with maximum ${limits.maxRain}%`
          }}
        </li>
      </ul>
      <p class="micro muted">
        Supporting measurements do not change the three matching rules.
      </p>
    </div>
  </div>
</template>
