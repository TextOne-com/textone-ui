<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from "reka-ui";
import { computed, ref, useId, watch } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Option, Size } from "../internal/types";
import { matchesAll } from "../utils/search";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * A choice from a long list, found by typing. The input is the combobox, named by the label (or
 * by `aria-label`). Typing filters by every word, accents folded; `filter` replaces that.
 *
 * `picker` mode is for adding things to a list: each pick is emitted as `select` and the field
 * empties, ready for the next one.
 */
const props = withDefaults(
  defineProps<{
    options: Option[];
    label?: string;
    description?: string;
    error?: string | boolean | null;
    placeholder?: string;
    nothingFound?: string;
    size?: Size;
    width?: number | string;
    disabled?: boolean;
    id?: string;
    /** At most this many options are drawn; typing narrows the rest. */
    limit?: number;
    filter?: (option: Option, query: string) => boolean;
    picker?: boolean;
    /** The list's width when it should be wider than the input (px or CSS length). */
    listWidth?: number | string;
    /** A button that empties the choice (the value becomes null). */
    clearable?: boolean;
    clearLabel?: string;
  }>(),
  { size: "sm", limit: 50, nothingFound: "Sin resultados", clearLabel: "Quitar" },
);

const model = defineModel<string | null>({ default: null });
const emit = defineEmits<{ select: [value: string] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();

const open = ref(false);
const search = ref("");
const byValue = computed(() => new Map(props.options.map((o) => [o.value, o])));
const labelOf = (value: unknown) =>
  typeof value === "string" ? (byValue.value.get(value)?.label ?? "") : "";

// The input shows the chosen option's label until the person types.
watch(
  [model, byValue],
  () => {
    if (!props.picker) search.value = labelOf(model.value);
  },
  { immediate: true },
);

const visible = computed(() => {
  const query = search.value.trim();
  const showAll = query === "" || (!props.picker && query === labelOf(model.value));
  const test = props.filter ?? ((o: Option, q: string) => matchesAll(q, [o.label, o.keywords, o.description]));
  const out: Option[] = [];
  for (const option of props.options) {
    if (showAll || test(option, query)) out.push(option);
    if (out.length >= props.limit) break;
  }
  return out;
});

const inner = computed({
  get: () => (props.picker ? undefined : (model.value ?? undefined)),
  set: (value: string | undefined) => {
    if (value === undefined) return;
    emit("select", value);
    if (props.picker) {
      search.value = "";
      return;
    }
    model.value = value;
    search.value = labelOf(value);
  },
});

const listStyle = computed(() =>
  props.listWidth === undefined
    ? undefined
    : { width: typeof props.listWidth === "number" ? `${props.listWidth}px` : props.listWidth },
);

const inputEl = ref<{ $el?: HTMLInputElement } | HTMLInputElement>();
function focus() {
  const el = inputEl.value;
  (el instanceof HTMLElement ? el : el?.$el)?.focus();
}
defineExpose({ focus });

function clear() {
  model.value = null;
  search.value = "";
  focus();
}

const widthStyle = computed(() =>
  props.width === undefined
    ? undefined
    : { width: typeof props.width === "number" ? `${props.width}px` : props.width },
);

// An abandoned search shows the choice again rather than leaving half a word behind. On close,
// not on blur: a click on an option blurs the input first, and redrawing the list then would
// pull the option out from under the pointer.
watch(open, (isOpen) => {
  if (!isOpen && !props.picker) search.value = labelOf(model.value);
});
</script>

<template>
  <TxField
    :id="inputId"
    :label="label"
    :description="description"
    :error="error"
    v-bind="root"
  >
    <ComboboxRoot
      v-model="inner"
      v-model:open="open"
      :ignore-filter="true"
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      :open-on-click="true"
      :disabled="disabled"
    >
      <ComboboxAnchor
        class="tx-input-wrap"
        :class="[`tx-input-wrap--${size}`, { 'tx-input-wrap--right': clearable && model }]"
        :style="widthStyle"
      >
        <ComboboxInput
          :id="inputId"
          ref="inputEl"
          v-model="search"
          class="tx-input"
          :class="`tx-input--${size}`"
          :placeholder="placeholder"
          :aria-invalid="error ? true : undefined"
          autocomplete="off"
          v-bind="control"
          @input="open = true"
        />
        <button
          v-if="clearable && model && !disabled"
          type="button"
          class="tx-select__clear"
          :aria-label="clearLabel"
          :title="clearLabel"
          @click="clear"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          position="popper"
          :side-offset="4"
          align="start"
          class="tx-popover tx-listbox"
          :style="listStyle"
        >
          <ComboboxViewport class="tx-listbox__viewport">
            <div v-if="visible.length === 0" class="tx-listbox__empty">{{ nothingFound }}</div>
            <ComboboxItem
              v-for="option in visible"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              class="tx-listbox__item"
            >
              <slot name="option" :option="option">
                <span class="tx-listbox__text">
                  <span>{{ option.label }}</span>
                  <span v-if="option.description" class="tx-listbox__description">{{ option.description }}</span>
                </span>
              </slot>
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TxField>
</template>
