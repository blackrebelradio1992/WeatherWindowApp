import { ref, onBeforeUnmount } from "vue";
export function useRequest() {
  const state = ref("Idle");
  const error = ref("");
  let active: AbortController | undefined;
  let sequence = 0;
  async function run<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    accept: (data: T) => void,
  ) {
    active?.abort();
    const mine = ++sequence;
    active = new AbortController();
    state.value = "Loading";
    error.value = "";
    try {
      const result = await operation(active.signal);
      if (mine !== sequence) return;
      accept(result);
      state.value = "Success";
    } catch (e) {
      if (mine !== sequence) return;
      const err = e as Error;
      if (err.name === "AbortError") state.value = "Cancelled";
      else {
        state.value = "Error";
        error.value = err.message || "Request failed.";
      }
    }
  }
  function cancel() {
    ++sequence;
    active?.abort();
    state.value = "Cancelled";
    error.value = "";
  }
  onBeforeUnmount(() => {
    ++sequence;
    active?.abort();
  });
  return { state, error, run, cancel };
}
