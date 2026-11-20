<script setup lang="ts">
/**
 * A table of figures. Write thead/tbody/tfoot inside it as plain HTML. `framed` sets it in the
 * ledger frame (hairline, sticky sunken header, scroll); `paper` on the documento surface.
 * Cells with class `tx-numeric` right-align with tabular figures; a row with `tx-totals` is a
 * totals row (weight and a rule, never a band).
 */
withDefaults(
  defineProps<{
    variant?: "plain" | "framed" | "paper";
    density?: "compact" | "default";
    /** CSS max-height for the frame's scroll area. */
    maxHeight?: string;
    label?: string;
  }>(),
  { variant: "plain", density: "compact" },
);
</script>

<template>
  <div
    class="tx-table-wrap"
    :class="`tx-table-wrap--${variant}`"
    :style="maxHeight ? { maxHeight } : undefined"
    :role="label ? 'region' : undefined"
    :aria-label="label"
    :tabindex="label ? 0 : undefined"
  >
    <table class="tx-table" :class="[`tx-table--${variant}`, `tx-table--${density}`]">
      <slot />
    </table>
  </div>
</template>
