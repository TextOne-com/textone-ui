<script setup lang="ts">
import { type CalendarDate, parseDate } from "@internationalized/date";
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarRoot,
} from "reka-ui";
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from "vue";
import CalendarMonths from "../internal/CalendarMonths.vue";
import CalendarNav from "../internal/CalendarNav.vue";
import { useSplitAttrs } from "../internal/attrs";
import type { Size } from "../internal/types";
import {
  type DateRange,
  formatDisplayDate,
  isIsoDate,
  localToday,
  rangePresets,
} from "../utils/dates";
import TxField from "./TxField.vue";

defineOptions({ inheritAttrs: false });

/**
 * A period: `{ start, end }` as ISO strings, or null. People think in named periods, so the
 * presets come first (este mes, mes anterior, trimestre…, or your own); a custom range is two
 * clicks on a two-month calendar — one month on a phone. The range is kept as soon as its end
 * is chosen, and the field says which preset it is when it is one.
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
    clearable?: boolean;
    clearLabel?: string;
    required?: boolean;
    inline?: boolean;
    /** Replaces the default named periods; `[]` for none. */
    presets?: { key: string; label: string; range: DateRange }[];
    /** The business's today (ISO); the device's otherwise. Presets count from it. */
    today?: string;
  }>(),
  {
    size: "sm",
    placeholder: "Elegir período",
    locale: "es-CO",
    clearLabel: "Quitar período",
    width: 260,
  },
);

const model = defineModel<DateRange | null>({ default: null });

const autoId = useId();
const triggerId = computed(() => props.id ?? autoId);
const { root, control } = useSplitAttrs();

const todayIso = computed(() => props.today ?? localToday());
const toCalendar = (iso: string | undefined) =>
  iso && isIsoDate(iso) ? parseDate(iso) : undefined;
const minDate = computed(() => toCalendar(props.min));
const maxDate = computed(() => toCalendar(props.max));
const todayDate = computed(() => parseDate(todayIso.value));

const inRange = (iso: string) =>
  (!props.min || iso >= props.min) && (!props.max || iso <= props.max);
const presetList = computed(() =>
  (props.presets ?? rangePresets(todayIso.value)).filter(
    (p) => inRange(p.range.start) && inRange(p.range.end),
  ),
);
const activePreset = computed(() =>
  model.value
    ? presetList.value.find(
        (p) => p.range.start === model.value?.start && p.range.end === model.value?.end,
      )
    : undefined,
);

const days = (r: DateRange) =>
  Math.round((Date.parse(r.end) - Date.parse(r.start)) / 86_400_000) + 1;
const short = (iso: string) =>
  new Intl.DateTimeFormat(props.locale, { timeZone: "UTC", day: "numeric", month: "short" })
    .format(new Date(`${iso}T00:00:00Z`))
    .replace(".", "");
const display = computed(() =>
  model.value
    ? `${formatDisplayDate(model.value.start)} – ${formatDisplayDate(model.value.end)}`
    : "",
);
const summary = (r: DateRange) =>
  `${short(r.start)} – ${short(r.end)} ${r.end.slice(0, 4)} · ${days(r) === 1 ? "1 día" : `${days(r)} días`}`;

// ── Calendar ──────────────────────────────────────────────────────────────
const open = ref(false);
const view = ref<"days" | "months">("days");
const narrow = ref(false);
const months = computed(() => (narrow.value ? 1 : 2));
const shown = shallowRef<CalendarDate>(todayDate.value);

/** While picking: Reka's range, start set and end pending. */
type CalRange = { start: CalendarDate | undefined; end: CalendarDate | undefined };
const draft = shallowRef<CalRange>({ start: undefined, end: undefined });

watch(open, (isOpen) => {
  if (!isOpen) return;
  view.value = "days";
  const start = toCalendar(model.value?.start);
  draft.value = { start, end: toCalendar(model.value?.end) };
  // The chosen range's start month on the left; otherwise the month before today, so today's
  // month is on the right with the past beside it.
  let left = start ?? todayDate.value.subtract({ months: months.value - 1 });
  if (minDate.value && left.compare(minDate.value) < 0) left = minDate.value;
  shown.value = left.set({ day: 1 });
});

const calendarValue = computed({
  get: () => draft.value as unknown as { start: CalendarDate; end: CalendarDate },
  set: (value: { start?: CalendarDate; end?: CalendarDate } | undefined) => {
    draft.value = { start: value?.start, end: value?.end };
    if (value?.start && value.end) {
      model.value = { start: value.start.toString(), end: value.end.toString() };
      open.value = false;
    }
  },
});

function pick(range: DateRange) {
  model.value = { ...range };
  open.value = false;
}
function clear() {
  model.value = null;
}

let query: MediaQueryList | undefined;
const onQuery = () => {
  narrow.value = !!query?.matches;
};
onMounted(() => {
  if (typeof matchMedia !== "function") return;
  query = matchMedia("(max-width: 639px)");
  onQuery();
  query.addEventListener("change", onQuery);
});
onBeforeUnmount(() => query?.removeEventListener("change", onQuery));

const widthStyle = computed(() =>
  props.width === undefined
    ? undefined
    : { width: typeof props.width === "number" ? `${props.width}px` : props.width },
);
</script>

<template>
  <TxField
    :id="triggerId"
    :label="label"
    :description="description"
    :error="error"
    :required="required"
    v-bind="root"
    :class="{ 'tx-field--inline': inline }"
  >
    <PopoverRoot v-model:open="open">
      <div class="tx-input-wrap tx-input-wrap--right" :class="`tx-input-wrap--${size}`" :style="widthStyle">
        <PopoverTrigger
          :id="triggerId"
          class="tx-input tx-select__trigger tx-range__trigger"
          :class="`tx-input--${size}`"
          :disabled="disabled"
          :aria-invalid="error ? true : undefined"
          :aria-labelledby="label ? `${triggerId}-label ${triggerId}-value` : undefined"
          v-bind="control"
        >
          <svg class="tx-range__icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M16 3v4M8 3v4M4 11h16M8 15h3M13 15h3" />
          </svg>
          <span v-if="model" :id="`${triggerId}-value`" class="tx-select__value tx-figures">
            <span v-if="activePreset" class="tx-range__preset">{{ activePreset.label }}</span>
            {{ display }}
          </span>
          <span v-else :id="`${triggerId}-value`" class="tx-select__value" data-placeholder>{{ placeholder }}</span>
        </PopoverTrigger>
        <span class="tx-input-wrap__section tx-input-wrap__section--right">
          <button
            v-if="clearable && model && !disabled"
            type="button"
            class="tx-date__clear"
            :aria-label="clearLabel"
            :title="clearLabel"
            @click="clear"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
          </button>
          <svg v-else class="tx-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </span>
      </div>
      <PopoverPortal>
        <PopoverContent
          :side-offset="6"
          align="start"
          :collision-padding="12"
          class="tx-popover tx-calendar-pop tx-range"
        >
          <div v-if="presetList.length" class="tx-range__presets" role="group" aria-label="Períodos">
            <button
              v-for="p in presetList"
              :key="p.key"
              type="button"
              class="tx-range__preset-item"
              :data-active="activePreset?.key === p.key || undefined"
              @click="pick(p.range)"
            >
              <span>{{ p.label }}</span>
              <span class="tx-range__preset-days">{{ days(p.range) }} d</span>
            </button>
          </div>
          <div class="tx-range__body">
            <RangeCalendarRoot
              v-slot="{ weekDays, grid }"
              v-model="calendarValue"
              v-model:placeholder="shown"
              :locale="locale"
              :week-starts-on="1"
              :min-value="minDate"
              :max-value="maxDate"
              :number-of-months="months"
              fixed-weeks
              class="tx-calendar"
            >
              <CalendarNav
                v-model:placeholder="shown"
                v-model:view="view"
                :months="months"
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
                  :selected="draft.start"
                  :today="todayDate"
                  @pick="(d) => { shown = d; view = 'days'; }"
                />
                <div v-else :key="`${shown.year}-${shown.month}`" class="tx-calendar__days">
                  <RangeCalendarGrid
                    v-for="month in grid"
                    :key="month.value.toString()"
                    class="tx-calendar__grid"
                  >
                    <RangeCalendarGridHead>
                      <RangeCalendarGridRow>
                        <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="tx-calendar__weekday">
                          {{ day }}
                        </RangeCalendarHeadCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridHead>
                    <RangeCalendarGridBody>
                      <RangeCalendarGridRow v-for="(week, i) in month.rows" :key="i">
                        <RangeCalendarCell v-for="day in week" :key="day.toString()" :date="day" class="tx-calendar__cell">
                          <RangeCalendarCellTrigger :day="day" :month="month.value" class="tx-calendar__day" />
                        </RangeCalendarCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridBody>
                  </RangeCalendarGrid>
                </div>
              </Transition>
            </RangeCalendarRoot>
            <div class="tx-calendar__foot">
              <p class="tx-calendar__spoken" aria-live="polite">
                <template v-if="draft.start && !draft.end">Elija el último día del período.</template>
                <template v-else-if="model">{{ summary(model) }}</template>
                <template v-else>Elija el primer día del período.</template>
              </p>
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </TxField>
</template>
