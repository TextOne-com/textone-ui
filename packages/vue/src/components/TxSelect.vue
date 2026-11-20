<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";
import { computed, useId } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Option, Size } from "../internal/types";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * A choice from a short list. The trigger is a combobox named by the label. `clearable` adds a
 * button that empties the choice (the value becomes null).
 */
const props = withDefaults(
  defineProps<{
    options: Option[];
    label?: string;
    description?: string;
    error?: string | boolean | null;
    placeholder?: string;
    size?: Size;
    width?: number | string;
    disabled?: boolean;
    clearable?: boolean;
    clearLabel?: string;
    id?: string;
    /** Label beside the control instead of above it, so a toolbar stays one row. */
    inline?: boolean;
  }>(),
  { size: "sm", clearLabel: "Quitar" },
);

const model = defineModel<string | null>({ default: null });

const autoId = useId();
const triggerId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();

const widthStyle = computed(() =>
  props.width === undefined
    ? undefined
    : { width: typeof props.width === "number" ? `${props.width}px` : props.width },
);

// Reka cannot hold null or "" as a value; undefined shows the placeholder.
const inner = computed({
  get: () => model.value ?? undefined,
  set: (v: string | undefined) => {
    model.value = v ?? null;
  },
});
</script>

<template>
  <TxField
    :id="triggerId"
    :label="label"
    :description="description"
    :error="error"
    v-bind="root"
    :class="{ 'tx-field--inline': inline }"
  >
    <div class="tx-input-wrap" :class="`tx-input-wrap--${size}`" :style="widthStyle">
      <SelectRoot v-model="inner" :disabled="disabled">
        <SelectTrigger
          :id="triggerId"
          class="tx-input tx-select__trigger"
          :class="[`tx-input--${size}`, { 'tx-select__trigger--clearable': clearable && model }]"
          :aria-invalid="error ? true : undefined"
          v-bind="control"
        >
          <SelectValue :placeholder="placeholder" class="tx-select__value" />
          <svg class="tx-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent position="popper" :side-offset="4" class="tx-popover tx-listbox">
            <SelectViewport class="tx-listbox__viewport">
              <SelectItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                class="tx-listbox__item"
              >
                <SelectItemText>{{ option.label }}</SelectItemText>
                <SelectItemIndicator class="tx-listbox__check">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                </SelectItemIndicator>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
      <button
        v-if="clearable && model && !disabled"
        type="button"
        class="tx-select__clear"
        :aria-label="clearLabel"
        :title="clearLabel"
        @click="model = null"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>
  </TxField>
</template>
