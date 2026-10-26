import { reactive, ref } from "vue";
import type { City, Limits } from "./types";
import { defaultLimits } from "./utils/filterHours";
export const selectedCity = ref<City | null>(null);
export const limits = reactive<Limits>({ ...defaultLimits });
