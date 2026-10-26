<script setup lang="ts">
import { ref } from "vue";
import { useRequest } from "../useRequest";
const { state, error, run, cancel } = useRequest();
const result = ref("");
function start(fail = false) {
  result.value = "";
  void run(
    (signal) =>
      new Promise<string>((resolve, reject) => {
        const timer = setTimeout(
          () =>
            fail
              ? reject(
                  new Error(
                    "Controlled example failure. Retry the success request.",
                  ),
                )
              : resolve("Delayed experiment completed."),
          2000,
        );
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(new DOMException("Cancelled", "AbortError"));
          },
          { once: true },
        );
      }),
    (v) => (result.value = v),
  );
}
</script>
<template>
  <section id="requests">
    <h2>06 / Request lifecycle</h2>
    <p>
      Controlled two-second simulation for repeatable loading, cancellation, and
      error checks. Live API sections use the same request controller.
    </p>
    <div class="controls">
      <button @click="start()">Start delayed success</button
      ><button @click="start(true)">Start controlled failure</button
      ><button @click="cancel" :disabled="state !== 'Loading'">
        Cancel experiment</button
      ><button @click="start()">Retry success</button>
    </div>
    <p role="status">Experiment: {{ state }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <output v-if="result">{{ result }}</output>
  </section>
</template>
