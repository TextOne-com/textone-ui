<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { computed } from "vue";

/**
 * The calendar's header, shared by TxDateField and TxDateRangeField: previous / next month and
 * the heading, which is a button — it turns the grid into the month-and-year view, so going
 * back two years is two clicks, not twenty-four.
 */
const props = defineProps<{
  placeholder: CalendarDate;
  months?: number;
  locale: string;
  view: "days" | "months";
  min?: CalendarDate;
  max?: CalendarDate;
}>();
const emit = defineEmits<{
  "update:placeholder": [value: CalendarDate];
  "update:view": [value: "days" | "months"];
}>();

const count = computed(() => props.months ?? 1);
const monthName = (d: CalendarDate, withYear: boolean) =>
  new Intl.DateTimeFormat(props.locale, {
    timeZone: "UTC",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(new Date(Date.UTC(d.year, d.month - 1, 1)));

const heading = computed(() => {
  if (props.view === "months") return String(props.placeholder.year);
  const first = props.placeholder;
  if (count.value === 1) return monthName(first, true);
  const last = first.add({ months: count.value - 1 });
  return first.year === last.year
    ? `${monthName(first, false)} – ${monthName(last, true)}`
    : `${monthName(first, true)} – ${monthName(last, true)}`;
});

const step = computed(() => (props.view === "months" ? { years: 1 } : { months: 1 }));
const index = (d: CalendarDate) => d.year * 12 + d.month;
const prevDisabled = computed(() => {
  if (!props.min) return false;
  const prev = props.placeholder.subtract(step.value);
  return props.view === "months" ? prev.year < props.min.year : index(prev) < index(props.min);
});
/** Next stops once the last month shown would pass the max. */
const nextDisabled = computed(() => {
  if (!props.max) return false;
  const next = props.placeholder.add(step.value);
  return props.view === "months"
    ? next.year > props.max.year
    : index(next) + count.value - 1 > index(props.max);
});
</script>

<template>
  <div class="tx-calendar__header">
    <button
      type="button"
      class="tx-calendar__nav"
      :aria-label="view === 'months' ? 'Ver año anterior' : 'Ver mes anterior'"
      :disabled="prevDisabled"
      @click="emit('update:placeholder', placeholder.subtract(step))"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
    </button>
    <button
      type="button"
      class="tx-calendar__heading"
      :aria-label="view === 'days' ? `${heading}. Elegir mes y año` : `${heading}. Volver a los días`"
      :aria-expanded="view === 'months'"
      @click="emit('update:view', view === 'days' ? 'months' : 'days')"
    >
      <Transition name="tx-heading" mode="out-in">
        <span :key="heading">{{ heading }}</span>
      </Transition>
      <svg viewBox="0 0 24 24" aria-hidden="true" :data-open="view === 'months' || undefined">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <button
      type="button"
      class="tx-calendar__nav"
      :aria-label="view === 'months' ? 'Ver año siguiente' : 'Ver mes siguiente'"
      :disabled="nextDisabled"
      @click="emit('update:placeholder', placeholder.add(step))"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  </div>
</template>
