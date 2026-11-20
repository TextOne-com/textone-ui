<script setup lang="ts">
import { type Component, computed } from "vue";
import type { Size } from "../internal/types";

/**
 * A button, or — with `as` (a RouterLink, an `a`) — a link that looks like one. A disabled link
 * renders with no href and cannot be followed.
 */
const props = withDefaults(
  defineProps<{
    variant?: "filled" | "default" | "subtle" | "light" | "danger";
    size?: Size;
    as?: string | Component;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
  }>(),
  { variant: "filled", size: "sm", as: "button", type: "button" },
);

const isNative = computed(() => props.as === "button");
const inert = computed(() => props.disabled || props.loading);
const tag = computed(() => (!isNative.value && inert.value ? "a" : props.as));
</script>

<template>
  <component
    :is="tag"
    class="tx-button"
    :class="[
      `tx-button--${variant}`,
      `tx-button--${size}`,
      { 'tx-button--full': fullWidth, 'tx-button--loading': loading },
    ]"
    :type="isNative ? type : undefined"
    :disabled="isNative ? inert : undefined"
    :aria-disabled="!isNative && inert ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :data-disabled="inert || undefined"
  >
    <span v-if="loading" class="tx-button__spinner" aria-hidden="true" />
    <span v-if="$slots.left" class="tx-button__section"><slot name="left" /></span>
    <span class="tx-button__label"><slot /></span>
    <span v-if="$slots.right" class="tx-button__section"><slot name="right" /></span>
  </component>
</template>
