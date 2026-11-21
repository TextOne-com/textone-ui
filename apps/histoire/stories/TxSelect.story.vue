<script setup lang="ts">
import { TxSelect } from "@textone-com/vue";
import { reactive } from "vue";

const users = [
  { value: "3", label: "Auxiliar local", description: "Registra remisiones y recibos", group: "Cartera" },
  { value: "4", label: "Aprobador local", description: "Aprueba notas crédito y ajustes", group: "Cartera" },
  { value: "6", label: "Bodega", description: "Conteos y entradas de inventario", group: "Inventario" },
  { value: "5", label: "Usuario inactivo", disabled: true, group: "Inventario" },
];
const state = reactive({
  value: null as string | null,
  label: "Actuando como",
  placeholder: "Elegir usuario",
  clearable: true,
  inline: false,
  disabled: false,
  error: "",
});
</script>

<template>
  <Story title="TxSelect" group="seleccion">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxSelect
          v-model="state.value"
          :options="users"
          :label="state.label"
          :placeholder="state.placeholder"
          :clearable="state.clearable"
          :inline="state.inline"
          :disabled="state.disabled"
          :error="state.error || undefined"
          :width="280"
        />
        <p class="story-note">Valor: <code>{{ JSON.stringify(state.value) }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.placeholder" title="placeholder" />
        <HstText v-model="state.error" title="error" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
        <HstCheckbox v-model="state.inline" title="inline" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxSelect

Una opción de una **lista corta** (hasta ~15). Para listas largas o que se buscan escribiendo, usa
`TxCombobox`.

```vue
<TxSelect
  v-model="seasonId"
  label="Temporada"
  :options="seasons.map((s) => ({ value: String(s.id), label: s.name }))"
/>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | `null` muestra el placeholder |
| `options` | `{ value, label, description?, group?, disabled? }[]` | — | `value` no puede ser `""`. Con `group`, se listan bajo su título; con `description`, en una segunda línea |
| `label`, `description`, `error`, `placeholder`, `disabled`, `id` | | | |
| `clearable` | `boolean` | `false` | Botón × que deja el valor en `null` |
| `clearLabel` | `string` | `"Quitar"` | Nombre accesible del × |
| `inline` | `boolean` | `false` | Etiqueta al lado (barras de herramientas) |
| `size`, `width` | | `sm` | |

Para más de una docena de opciones usa **TxCombobox** (busca); para varias a la vez, **TxMultiSelect**.

## Accesibilidad

El disparador es un `combobox` con el nombre de la etiqueta; las opciones son `option`. Flechas,
Enter, Escape y escribir la inicial funcionan como en un `<select>` nativo.
</docs>
