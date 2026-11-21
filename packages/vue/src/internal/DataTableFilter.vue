<script setup lang="ts" generic="Row">
import TxTextInput from "../components/TxTextInput.vue";
import type { DataColumn, FilterValue } from "../utils/dataTable";

/**
 * One column's filter control — text, a list of options or a min–max range. TxDataTable shows
 * it in a header's menu and, as cards on a phone, in its "Filtros" panel.
 */
const props = defineProps<{
  column: DataColumn<Row>;
  value: FilterValue;
  options: { value: string; label: string }[];
}>();
const emit = defineEmits<{ change: [value: FilterValue] }>();

function toggle(option: string) {
  if (props.value.kind !== "options") return;
  const values = props.value.values;
  emit("change", {
    kind: "options",
    values: values.includes(option) ? values.filter((v) => v !== option) : [...values, option],
  });
}
function setRange(end: "min" | "max", text: string) {
  const current = props.value.kind === "range" ? props.value : { kind: "range" as const };
  emit("change", { ...current, kind: "range", [end]: text });
}
</script>

<template>
  <TxTextInput
    v-if="value.kind === 'text'"
    :model-value="value.text"
    :aria-label="`Filtrar ${column.header}`"
    placeholder="Contiene…"
    size="xs"
    clearable
    @update:model-value="(t: string) => emit('change', { kind: 'text', text: t })"
  />
  <div
    v-else-if="value.kind === 'options'"
    class="tx-dt__options"
    role="group"
    :aria-label="`Filtrar ${column.header}`"
  >
    <label v-for="o in options" :key="o.value" class="tx-dt__check">
      <input type="checkbox" :checked="value.values.includes(o.value)" @change="toggle(o.value)" />
      <span>{{ o.label }}</span>
    </label>
  </div>
  <div v-else class="tx-dt__range">
    <TxTextInput
      :model-value="value.min ?? ''"
      :aria-label="`${column.header} desde`"
      placeholder="Desde"
      size="xs"
      inputmode="decimal"
      figures
      @update:model-value="(t: string) => setRange('min', t)"
    />
    <TxTextInput
      :model-value="value.max ?? ''"
      :aria-label="`${column.header} hasta`"
      placeholder="Hasta"
      size="xs"
      inputmode="decimal"
      figures
      @update:model-value="(t: string) => setRange('max', t)"
    />
  </div>
</template>
