<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from "reka-ui";
import { computed, ref, useId, watch } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import { groupOptions } from "../internal/options";
import type { Option, Size } from "../internal/types";
import { matchesAll } from "../utils/search";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * Several choices from a list, found by typing. The chosen ones sit in the field as chips (each
 * removable; Backspace in an empty search removes the last); past `maxChips` they fold into
 * "+N". `display="count"` shows "3 seleccionados" instead, for a toolbar filter.
 *
 * The list stays open while choosing, each option with a checkbox. Its head selects every
 * option — or, while searching, every one the search found — and clears the choice.
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
    required?: boolean;
    inline?: boolean;
    display?: "chips" | "count";
    maxChips?: number;
    /** Hide "select all / clear" in the list's head. */
    hideActions?: boolean;
    /** "3 seleccionados" — the count display and the screen reader's summary. */
    countLabel?: (n: number) => string;
    allLabel?: string;
    filter?: (option: Option, query: string) => boolean;
  }>(),
  {
    size: "sm",
    placeholder: "Elegir…",
    nothingFound: "Sin resultados",
    display: "chips",
    maxChips: 3,
    countLabel: (n: number) => (n === 1 ? "1 seleccionado" : `${n} seleccionados`),
    allLabel: "Todos",
  },
);

const model = defineModel<string[]>({ default: () => [] });

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();

const open = ref(false);
const search = ref("");
const byValue = computed(() => new Map(props.options.map((o) => [o.value, o])));
const chosen = computed(() =>
  model.value.map((v) => byValue.value.get(v)).filter((o): o is Option => !!o),
);

const visible = computed(() => {
  const q = search.value.trim();
  if (!q) return props.options;
  const test = props.filter ?? ((o: Option, query: string) => matchesAll(query, [o.label, o.keywords, o.description]));
  return props.options.filter((o) => test(o, q));
});
const groups = computed(() => groupOptions(visible.value));

const shownChips = computed(() =>
  props.display === "chips" ? chosen.value.slice(0, props.maxChips) : [],
);
const hidden = computed(() => chosen.value.slice(shownChips.value.length));

const selectable = computed(() => visible.value.filter((o) => !o.disabled));
const allSelected = computed(
  () =>
    selectable.value.length > 0 && selectable.value.every((o) => model.value.includes(o.value)),
);
const searching = computed(() => search.value.trim() !== "");

function toggleAll() {
  const values = selectable.value.map((o) => o.value);
  if (allSelected.value) model.value = model.value.filter((v) => !values.includes(v));
  else model.value = [...model.value, ...values.filter((v) => !model.value.includes(v))];
}
function clear() {
  model.value = [];
  search.value = "";
}
function remove(value: string) {
  model.value = model.value.filter((v) => v !== value);
}
function onBackspace() {
  if (search.value === "" && model.value.length) model.value = model.value.slice(0, -1);
}

watch(open, (isOpen) => {
  if (!isOpen) search.value = "";
});

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
    :error="error"
    :required="required"
    v-bind="root"
    :class="{ 'tx-field--inline': inline }"
  >
    <ComboboxRoot
      v-model="model"
      v-model:open="open"
      multiple
      :ignore-filter="true"
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      :open-on-click="true"
      :disabled="disabled"
    >
      <ComboboxAnchor
        class="tx-multi"
        :class="`tx-multi--${size}`"
        :data-invalid="error ? true : undefined"
        :data-disabled="disabled || undefined"
        :style="widthStyle"
      >
        <TransitionGroup name="tx-chip">
          <span v-for="o in shownChips" :key="o.value" class="tx-multi__chip">
            <span class="tx-multi__chip-text" :title="o.label">{{ o.label }}</span>
            <button
              type="button"
              class="tx-multi__chip-remove"
              :aria-label="`Quitar ${o.label}`"
              :disabled="disabled"
              tabindex="-1"
              @click.stop="remove(o.value)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
            </button>
          </span>
          <span
            v-if="display === 'chips' && hidden.length"
            key="more"
            class="tx-multi__chip tx-multi__chip--more"
            :title="hidden.map((o) => o.label).join(', ')"
          >
            +{{ hidden.length }}
          </span>
          <span v-if="display === 'count' && model.length" key="count" class="tx-multi__count">
            {{ model.length === options.length ? allLabel : countLabel(model.length) }}
          </span>
        </TransitionGroup>
        <ComboboxInput
          :id="inputId"
          v-model="search"
          class="tx-multi__input"
          :placeholder="model.length ? '' : placeholder"
          :aria-invalid="error ? true : undefined"
          :aria-description="model.length ? countLabel(model.length) : undefined"
          autocomplete="off"
          v-bind="control"
          @input="open = true"
          @keydown.backspace="onBackspace"
        />
        <button
          v-if="model.length && !disabled"
          type="button"
          class="tx-multi__clear"
          aria-label="Quitar todos"
          title="Quitar todos"
          tabindex="-1"
          @click.stop="clear"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
        <svg v-else class="tx-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          position="popper"
          :side-offset="6"
          align="start"
          :collision-padding="12"
          class="tx-popover tx-listbox tx-multi__list"
        >
          <div v-if="!hideActions && selectable.length" class="tx-listbox__head">
            <button type="button" class="tx-listbox__action" @click="toggleAll">
              <template v-if="allSelected">{{ searching ? "Quitar los encontrados" : "Quitar todos" }}</template>
              <template v-else-if="searching">Seleccionar los {{ selectable.length }} encontrados</template>
              <template v-else>Seleccionar todos ({{ selectable.length }})</template>
            </button>
            <span class="tx-listbox__tally">{{ model.length }} / {{ options.length }}</span>
          </div>
          <ComboboxViewport class="tx-listbox__viewport">
            <div v-if="visible.length === 0" class="tx-listbox__empty">{{ nothingFound }}</div>
            <template v-for="g in groups" :key="g.label ?? '_'">
              <ComboboxGroup>
                <ComboboxLabel v-if="g.label" class="tx-listbox__group">{{ g.label }}</ComboboxLabel>
                <ComboboxItem
                  v-for="option in g.options"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                  class="tx-listbox__item tx-listbox__item--check"
                >
                  <span class="tx-listbox__box" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span class="tx-listbox__text">
                    <slot name="option" :option="option">
                      <span>{{ option.label }}</span>
                      <span v-if="option.description" class="tx-listbox__description">{{ option.description }}</span>
                    </slot>
                  </span>
                </ComboboxItem>
              </ComboboxGroup>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TxField>
</template>
