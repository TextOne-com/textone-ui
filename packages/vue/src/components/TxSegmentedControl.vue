<script setup lang="ts">
import { useId } from "vue";
import type { Option, Size } from "../internal/types";

/**
 * Two to five mutually exclusive views, side by side. Native radios underneath, so arrow keys,
 * forms and screen readers behave as a radio group.
 */
withDefaults(
  defineProps<{ options: Option[]; label?: string; size?: Size; disabled?: boolean }>(),
  { size: "sm" },
);
const model = defineModel<string>({ required: true });
const name = useId();
</script>

<template>
  <div
    class="tx-segmented"
    :class="`tx-segmented--${size}`"
    role="radiogroup"
    :aria-label="label"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="tx-segmented__item"
      :data-active="model === option.value || undefined"
      :data-disabled="disabled || option.disabled || undefined"
    >
      <input
        v-model="model"
        type="radio"
        class="tx-visually-hidden"
        :name="name"
        :value="option.value"
        :disabled="disabled || option.disabled"
      />
      {{ option.label }}
    </label>
  </div>
</template>
