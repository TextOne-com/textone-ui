<script setup lang="ts">
import { CalendarDate, parseDate } from "@internationalized/date";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from "reka-ui";
import { computed, ref, useId, watch } from "vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Size } from "../internal/types";
import { formatDisplayDate, isIsoDate, parseDisplayDate } from "../utils/dates";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * A date typed day first (`30/06/2025`) or picked from a calendar, held as the ISO string. Empty
 * is "". What is typed is committed as soon as it reads as a date inside the range; on blur or
 * Enter a half-typed date goes back to the last good one rather than being guessed at.
 */
const props = withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    error?: string | boolean | null;
    placeholder?: string;
    min?: string;
    max?: string;
    size?: Size;
    width?: number | string;
    disabled?: boolean;
    id?: string;
    locale?: string;
    calendarLabel?: string;
    inline?: boolean;
    clearable?: boolean;
    required?: boolean;
  }>(),
  {
    size: "sm",
    placeholder: "dd/mm/aaaa",
    locale: "es-CO",
    calendarLabel: "Abrir calendario",
    width: 160,
  },
);

const model = defineModel<string>({ default: "" });

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();

const text = ref(formatDisplayDate(model.value));
watch(model, (iso) => {
  if (parseDisplayDate(text.value) !== iso) text.value = formatDisplayDate(iso);
});

function inRange(iso: string): boolean {
  if (props.min && iso < props.min) return false;
  if (props.max && iso > props.max) return false;
  return true;
}

function onInput() {
  const iso = parseDisplayDate(text.value);
  if (iso && inRange(iso)) model.value = iso;
  else if (text.value.trim() === "" && props.clearable) model.value = "";
}

function commit() {
  const iso = parseDisplayDate(text.value);
  if (iso && inRange(iso)) {
    model.value = iso;
    text.value = formatDisplayDate(iso);
  } else if (text.value.trim() === "" && props.clearable) {
    model.value = "";
  } else {
    text.value = formatDisplayDate(model.value);
  }
}

const open = ref(false);
const toCalendar = (iso: string | undefined) =>
  iso && isIsoDate(iso) ? parseDate(iso) : undefined;
const calendarValue = computed({
  get: () => toCalendar(model.value),
  set: (value: CalendarDate | undefined) => {
    if (!value) return;
    const iso = value.toString();
    model.value = iso;
    text.value = formatDisplayDate(iso);
    open.value = false;
  },
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
    <PopoverRoot v-model:open="open">
      <PopoverAnchor as-child>
        <div
          class="tx-input-wrap tx-input-wrap--right"
          :class="`tx-input-wrap--${size}`"
          :style="widthStyle"
        >
          <input
            :id="inputId"
            v-model="text"
            class="tx-input tx-figures"
            :class="`tx-input--${size}`"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="typeof error === 'string' && error ? `${inputId}-error` : undefined"
            v-bind="control"
            @input="onInput"
            @blur="commit"
            @keydown.enter="commit"
            @keydown.esc="commit"
          />
          <span class="tx-input-wrap__section tx-input-wrap__section--right">
            <slot name="right" />
            <PopoverTrigger
              class="tx-date__trigger"
              :aria-label="calendarLabel"
              :title="calendarLabel"
              :disabled="disabled"
              tabindex="-1"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="2.5" y="3.5" width="11" height="10" rx="1" fill="none" stroke="currentColor" />
                <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" />
              </svg>
            </PopoverTrigger>
          </span>
        </div>
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent :side-offset="4" align="start" class="tx-popover tx-calendar-pop">
          <CalendarRoot
            v-slot="{ weekDays, grid }"
            v-model="calendarValue"
            :locale="locale"
            :week-starts-on="1"
            :min-value="toCalendar(min)"
            :max-value="toCalendar(max)"
            :placeholder="toCalendar(model) ?? toCalendar(max)"
            fixed-weeks
            class="tx-calendar"
          >
            <CalendarHeader class="tx-calendar__header">
              <CalendarPrev class="tx-calendar__nav" aria-label="Mes anterior">‹</CalendarPrev>
              <CalendarHeading class="tx-calendar__heading" />
              <CalendarNext class="tx-calendar__nav" aria-label="Mes siguiente">›</CalendarNext>
            </CalendarHeader>
            <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="tx-calendar__grid">
              <CalendarGridHead>
                <CalendarGridRow>
                  <CalendarHeadCell v-for="day in weekDays" :key="day" class="tx-calendar__weekday">
                    {{ day }}
                  </CalendarHeadCell>
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody>
                <CalendarGridRow v-for="(week, i) in month.rows" :key="i">
                  <CalendarCell v-for="day in week" :key="day.toString()" :date="day">
                    <CalendarCellTrigger :day="day" :month="month.value" class="tx-calendar__day" />
                  </CalendarCell>
                </CalendarGridRow>
              </CalendarGridBody>
            </CalendarGrid>
          </CalendarRoot>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </TxField>
</template>
