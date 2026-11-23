<script setup lang="ts">
import type { Size } from "../internal/types";

/**
 * An icon-only button. `label` is required: it is the button's accessible name.
 * `positive` and `negative` are a decision's pair (a green check, a red ×): round, bordered and
 * tinted in their tone, filled on hover.
 */
withDefaults(
  defineProps<{
    label: string;
    variant?: "subtle" | "default" | "filled" | "danger" | "positive" | "negative";
    size?: Size;
    disabled?: boolean;
    type?: "button" | "submit";
  }>(),
  { variant: "subtle", size: "sm", type: "button" },
);
</script>

<template>
  <button
    :type="type"
    class="tx-icon-button"
    :class="[`tx-icon-button--${variant}`, `tx-icon-button--${size}`]"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
