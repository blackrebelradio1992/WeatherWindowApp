import { ref, reactive, computed, watch, onMounted } from "vue";
import type { City, Forecast, Limits } from "./types";
import type { Unit } from "./utils/weather";
import { filterHours, validateLimits } from "./utils/filterHours";
import {
  decodeProduct,
  PRODUCT_KEY,
  initialLimits,
  addRecent,
} from "./utils/productStorage";
import { getForecast } from "./services/api";
import { useRequest } from "./useRequest";
export function useWeather() {
  const city = ref<City | null>(null);
  const recent = ref<City[]>([]);
  const limits = reactive<Limits>({ ...initialLimits });
  const unit = ref<Unit>("F");
  const view = ref<"lookup" | "results">("lookup");
  const data = ref<Forecast | null>(null);
  const expanded = ref<number | null>(null);
  const notice = ref("");
  const request = useRequest();
  const validation = computed(() => validateLimits(limits));
  const matched = computed(() =>
    data.value && !validation.value
      ? filterHours(data.value.hours, limits)
      : [],
  );
  function persist() {
    if (validation.value) return;
    try {
      localStorage.setItem(
        PRODUCT_KEY,
        JSON.stringify({
          version: 1,
          city: city.value,
          recent: recent.value,
          limits: { ...limits },
          unit: unit.value,
        }),
      );
      notice.value = "";
    } catch {
      notice.value =
        "Your browser could not save preferences. The app still works for this visit.";
    }
  }
  async function refresh() {
    const c = city.value;
    if (!c) return;
    data.value = null;
    expanded.value = null;
    await request.run(
      (s) => getForecast(c.latitude, c.longitude, s),
      (v) => (data.value = v),
    );
  }
  function selectCity(c: City) {
    city.value = c;
    recent.value = addRecent(recent.value, c);
    view.value = "results";
    persist();
    void refresh();
  }
  function changeCity() {
    request.cancel();
    view.value = "lookup";
    expanded.value = null;
  }
  function cancelChange() {
    if (city.value) {
      view.value = "results";
      if (!data.value) void refresh();
    }
  }
  watch(
    [limits, unit],
    () => {
      expanded.value = null;
      persist();
    },
    { deep: true },
  );
  onMounted(() => {
    try {
      const saved = decodeProduct(localStorage.getItem(PRODUCT_KEY));
      if (saved) {
        Object.assign(limits, saved.limits);
        city.value = saved.city;
        recent.value = saved.recent;
        unit.value = saved.unit;
        if (city.value) {
          view.value = "results";
          void refresh();
        }
      }
    } catch {
      notice.value =
        "Saved preferences could not be read. Choose a city to start again.";
    }
  });
  return {
    city,
    recent,
    limits,
    unit,
    view,
    data,
    expanded,
    notice,
    validation,
    matched,
    selectCity,
    changeCity,
    cancelChange,
    refresh,
    ...request,
  };
}
