<script setup lang="ts">
import { type DateRange, TxDateRangeField } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  value: { start: "2025-10-01", end: "2025-10-31" } as DateRange | null,
  label: "Período",
  max: "2025-11-21",
  clearable: true,
  presets: true,
});
</script>

<template>
  <Story title="TxDateRangeField" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxDateRangeField
          v-model="state.value"
          :label="state.label"
          :max="state.max || undefined"
          :clearable="state.clearable"
          :presets="state.presets ? undefined : []"
          today="2025-11-21"
          :width="300"
        />
        <p class="story-note">Value: <code>{{ JSON.stringify(state.value) }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.max" title="max (ISO)" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
        <HstCheckbox v-model="state.presets" title="default presets" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDateRangeField

A **period**: `{ start, end }` in ISO, or `null`. People think in named periods, so the
**shortcuts come first**: last 7 and 30 days, this month, previous month, this quarter, previous
quarter and this year, counted from `today`. A custom range is **two clicks** on a **two-month**
calendar (one month on a phone, with the shortcuts as a row of chips on top).

```vue
<TxDateRangeField v-model="periodo" label="Período" :max="today" :today="today" clearable />
```

- The range is saved as soon as the last day is picked; the footer says what is missing ("Elija
  el último día…") and then the summary: `1 oct – 31 oct 2025 · 31 días`.
- If the range is a shortcut, the field names it: **Mes anterior** 01/10/2025 – 31/10/2025.
- Days between the ends sit on a band; the ends, in a pill.
- The month title opens the month view, as in TxDateField.

| Prop | Type | Default | |
|---|---|---|---|
| `modelValue` | `{ start, end } \| null` | `null` | |
| `min`, `max` | `string` (ISO) | — | Shortcuts that fall outside do not appear |
| `presets` | `{ key, label, range }[]` | `rangePresets(today)` | `[]` removes them |
| `today` | `string` (ISO) | the device's today | |
| `clearable` | `boolean` | `false` | |
| `label`, `description`, `error`, `placeholder`, `width`, `inline`, `disabled` | | | |

`rangePresets(today)` is exported so you can build your own from the standard ones.
</docs>
