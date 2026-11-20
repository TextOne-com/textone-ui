<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    descriptionPosition?: "above" | "below";
    error?: string | boolean | null;
    placeholder?: string;
    rows?: number;
    width?: number | string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    /** Grows with its text, from `rows` up to `maxRows`. */
    autosize?: boolean;
    maxRows?: number;
  }>(),
  { rows: 3, maxRows: 8 },
);

const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ blur: [FocusEvent] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();
const textarea = ref<HTMLTextAreaElement>();

function resize() {
  const el = textarea.value;
  if (!props.autosize || !el) return;
  const line = Number.parseFloat(getComputedStyle(el).lineHeight) || 19;
  const chrome = el.offsetHeight - el.clientHeight + 12;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight + chrome - 12, props.maxRows * line + chrome)}px`;
}
watch(model, () => nextTick(resize));
onMounted(resize);
defineExpose({ focus: () => textarea.value?.focus(), el: textarea });

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
    <textarea
      :id="inputId"
      ref="textarea"
      v-model="model"
      class="tx-input tx-textarea"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      v-bind="control"
      @blur="emit('blur', $event)"
    />
  </TxField>
</template>
