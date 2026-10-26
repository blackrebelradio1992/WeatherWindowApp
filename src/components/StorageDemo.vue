<script setup lang="ts">
import { ref } from "vue";
import { selectedCity, limits } from "../labState";
import {
  savePreferences,
  loadPreferences,
  clearPreferences,
} from "../utils/storage";
import { validateLimits } from "../utils/filterHours";
const message = ref("Nothing loaded yet.");
function action(kind: string) {
  try {
    if (kind === "save") {
      const invalid = validateLimits(limits);
      if (invalid) throw new Error(invalid);
      savePreferences({
        version: 1,
        city: selectedCity.value,
        limits: { ...limits },
      });
      message.value = "Saved city and limits.";
    } else if (kind === "load") {
      const p = loadPreferences();
      if (!p) {
        message.value = "No saved data.";
        return;
      }
      selectedCity.value = p.city;
      Object.assign(limits, p.limits);
      message.value = "Restored city and limits.";
    } else {
      clearPreferences();
      message.value = "Saved data cleared. Current inputs are unchanged.";
    }
  } catch (e) {
    message.value = `Storage error: ${(e as Error).message}`;
  }
}
</script>
<template>
  <section id="storage">
    <h2>05 / Local storage</h2>
    <p>
      Save the city from Demo 2 and limits from Demo 4. After a reload, choose
      Load to restore them. Storage belongs to this browser and site address.
    </p>
    <div class="controls">
      <button @click="action('save')">Save preferences</button
      ><button @click="action('load')">Load preferences</button
      ><button class="secondary" @click="action('clear')">
        Clear saved data
      </button>
    </div>
    <p role="status">{{ message }}</p>
  </section>
</template>
