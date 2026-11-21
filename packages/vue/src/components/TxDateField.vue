<script setup lang="ts">
import { type CalendarDate, parseDate } from "@internationalized/date";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarRoot,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from "reka-ui";
import { computed, ref, shallowRef, useId, watch } from "vue";
import CalendarMonths from "../internal/CalendarMonths.vue";
import CalendarNav from "../internal/CalendarNav.vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Size } from "../internal/types";
import {
  describeDate,
  formatDisplayDate,
  isIsoDate,
  localToday,
  maskDateInput,
  parseDisplayDate,
} from "../utils/dates";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * A date typed day first or picked from a calendar, held as the ISO string ("" when empty).
 *
 * Typing: digits get their slashes as they come (`30062025` → `30/06/2025`); what is typed is
 * committed as soon as it reads as a date inside the range, and the weekday shows in the field
 * so a slip (`03/06` for `06/03`) is caught at a glance. On blur or Enter a half-typed date goes
 * back to the last good one rather than being guessed at. Alt+↓ opens the calendar.
 *
 * Calendar: the heading opens a month-and-year view; `Hoy` and any `presets` sit in its foot,
 * with the chosen date said in words.
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
    clearLabel?: string;
    required?: boolean;
    /** Named dates offered in the calendar's foot ("Fin de mes", "Cierre 2024"). */
    presets?: { label: string; value: string }[];
    /** The business's today (ISO); the device's otherwise. */
    today?: string;
    todayLabel?: string;
    /** Hide the weekday shown inside the field. */
    hideWeekday?: boolean;
  }>(),
  {
    size: "sm",
    placeholder: "dd/mm/aaaa",
    locale: "es-CO",
    calendarLabel: "Abrir calendario",
    clearLabel: "Borrar fecha",
    todayLabel: "Hoy",
    width: 168,
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

function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const typedAtEnd = input.selectionStart === input.value.length;
  const masked = maskDateInput(input.value);
  // Only reshape while typing at the end: editing the middle keeps the caret where it is.
  if (typedAtEnd && masked !== input.value) text.value = masked;
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

function clear() {
  model.value = "";
  text.value = "";
}

const todayIso = computed(() => props.today ?? localToday());
const toCalendar = (iso: string | undefined) =>
  iso && isIsoDate(iso) ? parseDate(iso) : undefined;
const minDate = computed(() => toCalendar(props.min));
const maxDate = computed(() => toCalendar(props.max));
const todayDate = computed(() => parseDate(todayIso.value));

const open = ref(false);
const view = ref<"days" | "months">("days");
/** The month on screen. */
const shown = shallowRef<CalendarDate>(toCalendar(model.value) ?? todayDate.value);

watch(open, (isOpen) => {
  if (!isOpen) return;
  view.value = "days";
  let start = toCalendar(model.value) ?? todayDate.value;
  if (maxDate.value && start.compare(maxDate.value) > 0) start = maxDate.value;
  if (minDate.value && start.compare(minDate.value) < 0) start = minDate.value;
  shown.value = start;
});

function choose(iso: string) {
  model.value = iso;
  text.value = formatDisplayDate(iso);
  open.value = false;
}

const calendarValue = computed({
  get: () => toCalendar(model.value),
  set: (value: CalendarDate | undefined) => {
    if (value) choose(value.toString());
  },
});

const weekday = computed(() =>
  props.hideWeekday || !model.value ? "" : describeDate(model.value, props.locale, true),
);
const spoken = computed(() => (model.value ? describeDate(model.value, props.locale) : ""));
const todayAllowed = computed(() => inRange(todayIso.value));

function onKeydown(event: KeyboardEvent) {
  if (event.altKey && event.key === "ArrowDown") {
    event.preventDefault();
    open.value = true;
  }
}

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
          class="tx-input-wrap tx-input-wrap--right tx-date"
          :class="`tx-input-wrap--${size}`"
          :data-open="open || undefined"
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
            maxlength="10"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="typeof error === 'string' && error ? `${inputId}-error` : undefined"
            v-bind="control"
            @input="onInput"
            @blur="commit"
            @keydown="onKeydown"
            @keydown.enter="commit"
            @keydown.esc="commit"
          />
          <span class="tx-input-wrap__section tx-input-wrap__section--right">
            <slot name="right" />
            <Transition name="tx-fade">
              <span v-if="weekday" :key="weekday" class="tx-date__weekday" aria-hidden="true">{{ weekday }}</span>
            </Transition>
            <button
              v-if="clearable && model && !disabled"
              type="button"
              class="tx-date__clear"
              :aria-label="clearLabel"
              :title="clearLabel"
              tabindex="-1"
              @click="clear"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
            </button>
            <PopoverTrigger
              class="tx-date__trigger"
              :aria-label="calendarLabel"
              :title="`${calendarLabel} (Alt+↓)`"
              :disabled="disabled"
              tabindex="-1"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M16 3v4M8 3v4M4 11h16M8 15h2" />
              </svg>
            </PopoverTrigger>
          </span>
        </div>
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent
          :side-offset="6"
          align="start"
          :collision-padding="12"
          class="tx-popover tx-calendar-pop"
        >
          <CalendarRoot
            v-slot="{ weekDays, grid }"
            v-model="calendarValue"
            v-model:placeholder="shown"
            :locale="locale"
            :week-starts-on="1"
            :min-value="minDate"
            :max-value="maxDate"
            fixed-weeks
            class="tx-calendar"
          >
            <CalendarNav
              v-model:placeholder="shown"
              v-model:view="view"
              :locale="locale"
              :min="minDate"
              :max="maxDate"
            />
            <Transition name="tx-view" mode="out-in">
              <CalendarMonths
                v-if="view === 'months'"
                :placeholder="shown"
                :locale="locale"
                :min="minDate"
                :max="maxDate"
                :selected="calendarValue"
                :today="todayDate"
                @pick="(d) => { shown = d; view = 'days'; }"
              />
              <div v-else :key="`${shown.year}-${shown.month}`" class="tx-calendar__days">
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
                      <CalendarCell v-for="day in week" :key="day.toString()" :date="day" class="tx-calendar__cell">
                        <CalendarCellTrigger :day="day" :month="month.value" class="tx-calendar__day" />
                      </CalendarCell>
                    </CalendarGridRow>
                  </CalendarGridBody>
                </CalendarGrid>
              </div>
            </Transition>
          </CalendarRoot>
          <div class="tx-calendar__foot">
            <div class="tx-calendar__presets">
              <button
                v-if="todayAllowed"
                type="button"
                class="tx-chip"
                :data-active="model === todayIso || undefined"
                @click="choose(todayIso)"
              >
                {{ todayLabel }}
              </button>
              <button
                v-for="p in presets ?? []"
                :key="p.value"
                type="button"
                class="tx-chip"
                :data-active="model === p.value || undefined"
                :disabled="!inRange(p.value) || undefined"
                @click="choose(p.value)"
              >
                {{ p.label }}
              </button>
            </div>
            <p v-if="spoken" class="tx-calendar__spoken" aria-live="polite">{{ spoken }}</p>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </TxField>
</template>
