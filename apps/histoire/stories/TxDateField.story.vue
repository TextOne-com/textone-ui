<script setup lang="ts">
import { TxDateField } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  value: "2025-06-30",
  label: "Fecha de corte",
  min: "2024-01-01",
  max: "2025-12-31",
  error: "",
  clearable: true,
  required: false,
  presets: true,
});
const presets = [
  { label: "Cierre 2024", value: "2024-12-31" },
  { label: "Fin del 1.er semestre", value: "2025-06-30" },
];
</script>

<template>
  <Story title="TxDateField" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxDateField
          v-model="state.value"
          :label="state.label"
          :min="state.min || undefined"
          :max="state.max || undefined"
          :error="state.error || undefined"
          :clearable="state.clearable"
          :required="state.required"
          :presets="state.presets ? presets : undefined"
          today="2025-11-21"
        />
        <p class="story-note">
          Stored as <code>{{ JSON.stringify(state.value) }}</code>. Try typing only digits
          (<code>15032025</code>), opening the calendar with <kbd>Alt</kbd>+<kbd>↓</kbd> and
          clicking the month title to jump between years.
        </p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.min" title="min (ISO)" />
        <HstText v-model="state.max" title="max (ISO)" />
        <HstText v-model="state.error" title="error" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
        <HstCheckbox v-model="state.required" title="required" />
        <HstCheckbox v-model="state.presets" title="presets" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDateField

A date **typed day first** or picked from a calendar, stored as ISO text
(`2025-06-30`, or `""` when empty). It never creates a `Date`: no time zone shifts a document to
the previous day.

```vue
<TxDateField
  v-model="form.date"
  label="Fecha"
  :min="season.starts_on"
  :max="today"
  :today="today"
  :presets="[{ label: 'Cierre 2024', value: '2024-12-31' }]"
  clearable
/>
```

## Typing

- **Slashes insert themselves**: `30062025` → `30/06/2025`, handy on a numeric keypad. If you
  type your own separators (`2-11-26`, `2.11.2026`), they are respected.
- As soon as the text is a valid date within range, it is saved; **the weekday appears inside
  the field** (`lun`), so a `03/06` that should have been `06/03` stands out.
- On blur, Enter or Escape, half-typed text **reverts to the last good date**: nothing is guessed.

## Calendar

- <kbd>Alt</kbd>+<kbd>↓</kbd> or the button opens it; arrows move through the days, Enter picks.
- **The month title is a button**: it opens the year's month view, whose arrows change the year.
  Going back two years takes two clicks, not twenty-four.
- Today has a dot underneath. Dates outside `min`/`max` cannot be picked.
- In the footer: **Hoy** (Today), the `presets` you pass, and the chosen date spelled out in words.
- On touch screens, days are 40 px.

| Prop | Type | Default | |
|---|---|---|---|
| `modelValue` | `string` (ISO or `""`) | `""` | |
| `label`, `description`, `error`, `required`, `disabled`, `id` | | | |
| `min`, `max` | `string` (ISO) | — | Out-of-range dates are not accepted |
| `clearable` | `boolean` | `false` | The × button and empty text leave `""` |
| `presets` | `{ label, value }[]` | — | Named dates in the calendar footer |
| `today` | `string` (ISO) | the device's today | Pass the business's today (Bogotá time zone) |
| `todayLabel` | `string` | `"Hoy"` | |
| `hideWeekday` | `boolean` | `false` | |
| `inline` | `boolean` | `false` | Label alongside (toolbars) |
| `width` | `number \| string` | `168` | |
| `locale` | `string` | `es-CO` | |

**Slot:** `right` (before the calendar button).

Also exported: `parseDisplayDate`, `formatDisplayDate`, `maskDateInput`, `describeDate`,
`isIsoDate` and `localToday`.
</docs>
