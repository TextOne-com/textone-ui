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
    /** A × that empties the field (Escape does too). */
    clearable?: boolean;
    clearLabel?: string;
    /** A limit, shown as "12 / 80" under the field once the text nears it. */
    maxlength?: number;
  }>(),
  { type: "text", size: "sm", align: "left", clearLabel: "Borrar" },
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

/** The counter appears from 80 % of the limit: before that it is noise. */
const showCount = computed(
  () => props.maxlength !== undefined && model.value.length >= props.maxlength * 0.8,
);
const canClear = computed(() => props.clearable && !!model.value && !props.disabled && !props.readonly);
function clear() {
  model.value = "";
  input.value?.focus();
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && canClear.value) {
    event.stopPropagation();
    model.value = "";
  }
  emit("keydown", event);
}

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
      :class="[`tx-input-wrap--${size}`, { 'tx-input-wrap--left': $slots.left, 'tx-input-wrap--right': $slots.right || clearable }]"
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
        :maxlength="maxlength"
        v-bind="control"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keydown="onKeydown"
      />
      <span v-if="$slots.right || canClear" class="tx-input-wrap__section tx-input-wrap__section--right">
        <Transition name="tx-pop">
          <button
            v-if="canClear"
            type="button"
            class="tx-date__clear"
            :aria-label="clearLabel"
            :title="clearLabel"
            tabindex="-1"
            @click="clear"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
          </button>
        </Transition>
        <slot name="right" />
      </span>
    </div>
    <div v-if="showCount" class="tx-field__counter" :data-full="model.length >= (maxlength ?? 0) || undefined" aria-live="polite">
      {{ model.length }} / {{ maxlength }}
    </div>
    <slot name="after" />
  </TxField>
</template>
