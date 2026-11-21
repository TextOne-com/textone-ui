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
          Guardado como <code>{{ JSON.stringify(state.value) }}</code>. Prueba escribir solo
          números (<code>15032025</code>), abrir el calendario con <kbd>Alt</kbd>+<kbd>↓</kbd> y
          pulsar el título del mes para saltar de año.
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

Una fecha **escrita día primero** o elegida en un calendario, guardada como texto ISO
(`2025-06-30`, o `""` vacía). Nunca crea un `Date`: ninguna zona horaria mueve un documento al
día anterior.

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

## Escribir

- **Las barras se ponen solas**: `30062025` → `30/06/2025`, cómodo en teclado numérico. Si
  escribes tus propios separadores (`2-11-26`, `2.11.2026`), se respetan.
- En cuanto el texto es una fecha válida y dentro del rango, se guarda; **el día de la semana
  aparece dentro del campo** (`lun`), así se nota un `03/06` que debía ser `06/03`.
- Al salir, Enter o Escape, un texto a medias **vuelve a la última fecha buena**: no se adivina.

## Calendario

- <kbd>Alt</kbd>+<kbd>↓</kbd> o el botón lo abren; flechas para moverse por los días, Enter elige.
- **El título del mes es un botón**: abre la vista de meses del año, y sus flechas cambian de
  año. Volver dos años atrás son dos clics, no veinticuatro.
- Hoy lleva un punto debajo. Fuera de `min`/`max` no se puede elegir.
- Al pie: **Hoy**, los `presets` que pases y la fecha elegida dicha en palabras.
- En pantallas táctiles los días miden 40 px.

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `string` (ISO o `""`) | `""` | |
| `label`, `description`, `error`, `required`, `disabled`, `id` | | | |
| `min`, `max` | `string` (ISO) | — | Fuera del rango no se acepta |
| `clearable` | `boolean` | `false` | Botón × y texto vacío dejan `""` |
| `presets` | `{ label, value }[]` | — | Fechas con nombre al pie del calendario |
| `today` | `string` (ISO) | hoy del dispositivo | Pásale el hoy del negocio (zona Bogotá) |
| `todayLabel` | `string` | `"Hoy"` | |
| `hideWeekday` | `boolean` | `false` | |
| `inline` | `boolean` | `false` | Etiqueta al lado (barras de herramientas) |
| `width` | `number \| string` | `168` | |
| `locale` | `string` | `es-CO` | |

**Slot:** `right` (antes del botón del calendario).

Se exportan `parseDisplayDate`, `formatDisplayDate`, `maskDateInput`, `describeDate`,
`isIsoDate` y `localToday`.
</docs>
