<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { computed } from "vue";

/** The month-and-year view: twelve months of the shown year; choosing one goes back to days. */
const props = defineProps<{
  placeholder: CalendarDate;
  locale: string;
  min?: CalendarDate;
  max?: CalendarDate;
  /** The chosen date (or range start), marked. */
  selected?: CalendarDate;
  today: CalendarDate;
}>();
const emit = defineEmits<{ pick: [value: CalendarDate] }>();

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const key = props.placeholder.year * 12 + month;
    const label = new Intl.DateTimeFormat(props.locale, { timeZone: "UTC", month: "short" })
      .format(new Date(Date.UTC(2000, i, 1)))
      .replace(".", "");
    return {
      month,
      label,
      disabled:
        (props.min && key < props.min.year * 12 + props.min.month) ||
        (props.max && key > props.max.year * 12 + props.max.month),
      current: props.today.year === props.placeholder.year && props.today.month === month,
      selected: props.selected?.year === props.placeholder.year && props.selected?.month === month,
    };
  }),
);
</script>

<template>
  <div class="tx-calendar__months" role="group">
    <button
      v-for="m in months"
      :key="m.month"
      type="button"
      class="tx-calendar__month"
      :disabled="m.disabled || undefined"
      :data-current="m.current || undefined"
      :data-selected="m.selected || undefined"
      @click="emit('pick', placeholder.set({ month: m.month, day: 1 }))"
    >
      {{ m.label }}
    </button>
  </div>
</template>
