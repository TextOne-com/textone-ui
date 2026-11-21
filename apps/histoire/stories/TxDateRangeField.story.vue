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
        <p class="story-note">Valor: <code>{{ JSON.stringify(state.value) }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.max" title="max (ISO)" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
        <HstCheckbox v-model="state.presets" title="presets por defecto" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDateRangeField

Un **período**: `{ start, end }` en ISO, o `null`. La gente piensa en períodos con nombre, así
que los **atajos van primero**: últimos 7 y 30 días, este mes, mes anterior, este trimestre,
trimestre anterior y este año, contados desde `today`. Un rango propio son **dos clics** en un
calendario de **dos meses** (uno en el teléfono, con los atajos como fila de chips arriba).

```vue
<TxDateRangeField v-model="periodo" label="Período" :max="today" :today="today" clearable />
```

- El rango se guarda en cuanto se elige el último día; el pie dice qué falta ("Elija el último
  día…") y luego el resumen: `1 oct – 31 oct 2025 · 31 días`.
- Si el rango es un atajo, el campo lo nombra: **Mes anterior** 01/10/2025 – 31/10/2025.
- Los días entre los extremos van en una franja; los extremos, en píldora.
- El título del mes abre la vista de meses, como en TxDateField.

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `{ start, end } \| null` | `null` | |
| `min`, `max` | `string` (ISO) | — | Los atajos que se salen no aparecen |
| `presets` | `{ key, label, range }[]` | `rangePresets(today)` | `[]` los quita |
| `today` | `string` (ISO) | hoy del dispositivo | |
| `clearable` | `boolean` | `false` | |
| `label`, `description`, `error`, `placeholder`, `width`, `inline`, `disabled` | | | |

`rangePresets(today)` se exporta para armar los tuyos a partir de los de siempre.
</docs>
