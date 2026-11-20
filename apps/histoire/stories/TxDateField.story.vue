<script setup lang="ts">
import { TxDateField } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  value: "2025-06-30",
  label: "Fecha",
  min: "2025-02-01",
  max: "2025-11-30",
  error: "",
  clearable: false,
  required: false,
});
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
        />
        <p class="story-note">
          Guardado como <code>{{ JSON.stringify(state.value) }}</code> — ISO, sin zona horaria.
          Prueba escribir <code>15/3/25</code>, <code>15-03-2025</code> o una fecha fuera del rango.
        </p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.min" title="min (ISO)" />
        <HstText v-model="state.max" title="max (ISO)" />
        <HstText v-model="state.error" title="error" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
        <HstCheckbox v-model="state.required" title="required" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDateField

Una fecha **escrita día primero** (`30/06/2025`) o elegida en un calendario, guardada como el
texto ISO (`2025-06-30`). Nunca crea un `Date`, así ninguna zona horaria mueve un documento al
día anterior.

```vue
<TxDateField v-model="form.date" label="Fecha" :min="season.starts_on" :max="season.ends_on" />
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `string` (ISO o `""`) | `""` | |
| `label`, `description`, `error`, `required`, `disabled`, `id` | | | |
| `min`, `max` | `string` (ISO) | — | Fuera del rango no se acepta |
| `clearable` | `boolean` | `false` | Si se borra el texto, el valor queda `""` |
| `inline` | `boolean` | `false` | Etiqueta al lado (barras de herramientas) |
| `width` | `number \| string` | `160` | |
| `locale` | `string` | `es-CO` | Nombres de meses y días del calendario |

**Slot:** `right` (antes del botón del calendario; p. ej. "Hoy").

## Cómo lee lo escrito

- Acepta `/`, `-` o `.` y año de 2 o 4 cifras: `2-11-26` → `2026-11-02`.
- Mientras escribes, en cuanto el texto es una fecha válida y dentro del rango, se guarda.
- Al salir (o con Enter / Escape), un texto a medias **vuelve a la última fecha buena** en vez de
  adivinar.
- El calendario empieza en lunes. El botón del calendario está fuera del orden de tabulación;
  el campo se usa entero con teclado.

Las funciones `parseDisplayDate`, `formatDisplayDate` e `isIsoDate` se exportan para usarlas fuera.
</docs>
