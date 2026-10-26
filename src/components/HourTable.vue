<script setup lang="ts">
import type { Hour } from "../types";
defineProps<{ hours: Hour[]; timezone: string; sample?: boolean }>();
function timeLabel(time: number, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(time * 1000));
  } catch {
    return "Unknown timezone";
  }
}
</script>
<template>
  <div class="table-wrap">
    <table>
      <caption>
        {{
          sample ? "Fixed sample records" : "Forecast records"
        }}
        — °F, mph, rain probability %
      </caption>
      <thead>
        <tr>
          <th>{{ sample ? "Sample" : "Local time" }}</th>
          <th>Temperature °F</th>
          <th>Wind mph</th>
          <th>Rain %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(h, i) in hours" :key="h.time">
          <td>
            {{
              sample ? String.fromCharCode(65 + i) : timeLabel(h.time, timezone)
            }}
          </td>
          <td>{{ h.temperature ?? "Unavailable" }}</td>
          <td>{{ h.wind ?? "Unavailable" }}</td>
          <td>{{ h.rain ?? "Unavailable" }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="!hours.length">No matching records.</p>
  </div>
</template>
