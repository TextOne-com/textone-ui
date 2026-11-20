<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Size } from "../internal/types";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    descriptionPosition?: "above" | "below";
    error?: string | boolean | null;
    placeholder?: string;
    type?: string;
    size?: Size;
    align?: "left" | "right";
    /** A width in px, or any CSS length. */
    width?: number | string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    id?: string;
    /** Tabular figures, for money and quantities. */
    figures?: boolean;
  }>(),
  { type: "text", size: "sm", align: "left" },
);

const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ blur: [FocusEvent]; focus: [FocusEvent]; keydown: [KeyboardEvent] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();
const input = ref<HTMLInputElement>();

const describedBy = computed(
  () =>
    [
      props.description ? `${inputId.value}-description` : null,
      typeof props.error === "string" && props.error ? `${inputId.value}-error` : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);

const widthStyle = computed(() =>
  props.width === undefined
    ? undefined
    : { width: typeof props.width === "number" ? `${props.width}px` : props.width },
);

defineExpose({ focus: () => input.value?.focus(), el: input });
</script>

<template>
  <TxField
    :id="inputId"
    :label="label"
    :description="description"
    :description-position="descriptionPosition"
    :error="error"
    :required="required"
    v-bind="root"
    :style="[root.style as any, widthStyle]"
  >
    <div
      class="tx-input-wrap"
      :class="[`tx-input-wrap--${size}`, { 'tx-input-wrap--left': $slots.left, 'tx-input-wrap--right': $slots.right }]"
    >
      <span v-if="$slots.left" class="tx-input-wrap__section tx-input-wrap__section--left">
        <slot name="left" />
      </span>
      <input
        :id="inputId"
        ref="input"
        v-model="model"
        class="tx-input"
        :class="[`tx-input--${size}`, { 'tx-input--right': align === 'right', 'tx-figures': figures }]"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        v-bind="control"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keydown="emit('keydown', $event)"
      />
      <span v-if="$slots.right" class="tx-input-wrap__section tx-input-wrap__section--right">
        <slot name="right" />
      </span>
    </div>
    <slot name="after" />
  </TxField>
</template>
