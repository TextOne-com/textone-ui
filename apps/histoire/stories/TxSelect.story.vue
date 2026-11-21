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
        <p class="story-note">Value: <code>{{ JSON.stringify(state.value) }}</code></p>
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

One option from a **short list** (up to ~15). For long lists or ones searched by typing, use
`TxCombobox`.

```vue
<TxSelect
  v-model="seasonId"
  label="Temporada"
  :options="seasons.map((s) => ({ value: String(s.id), label: s.name }))"
/>
```

| Prop | Type | Default | |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | `null` shows the placeholder |
| `options` | `{ value, label, description?, group?, disabled? }[]` | — | `value` cannot be `""`. With `group`, they are listed under their heading; with `description`, on a second line |
| `label`, `description`, `error`, `placeholder`, `disabled`, `id` | | | |
| `clearable` | `boolean` | `false` | An × button that sets the value to `null` |
| `clearLabel` | `string` | `"Quitar"` | The ×'s accessible name |
| `inline` | `boolean` | `false` | Label alongside (toolbars) |
| `size`, `width` | | `sm` | |

For more than a dozen options use **TxCombobox** (searchable); for several at once, **TxMultiSelect**.

## Accessibility

The trigger is a `combobox` named after the label; the options are `option`s. Arrow keys, Enter,
Escape and typing the first letter work as in a native `<select>`.
</docs>
