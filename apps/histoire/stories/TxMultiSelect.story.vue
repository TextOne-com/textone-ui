<script setup lang="ts">
import { TxMultiSelect } from "@textone-com/vue";
import { reactive } from "vue";

// Fictitious: no real distributors on a public page.
const accounts = [
  { value: "1", label: "Librería El Faro", description: "EC 01-01", group: "Bogotá" },
  { value: "2", label: "Colegio Los Pinos", description: "EC 01-02", group: "Bogotá" },
  { value: "3", label: "Papelería Central", description: "EC 01-03", group: "Bogotá" },
  { value: "4", label: "Distribuidora Andina", description: "EC 02-01", group: "Medellín" },
  { value: "5", label: "Colegio San Rafael", description: "EC 02-02", group: "Medellín" },
  { value: "6", label: "Librería Letras", description: "EC 03-01", group: "Cali" },
  { value: "7", label: "Instituto Pacífico", description: "EC 03-02", group: "Cali", disabled: true },
];
const state = reactive({
  value: ["1", "4", "5", "6"] as string[],
  label: "Cuentas",
  display: "chips" as "chips" | "count",
  maxChips: 2,
  error: "",
});
</script>

<template>
  <Story title="TxMultiSelect" group="seleccion">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxMultiSelect
          v-model="state.value"
          :options="accounts"
          :label="state.label"
          :display="state.display"
          :max-chips="state.maxChips"
          :error="state.error || undefined"
          :count-label="(n) => (n === 1 ? '1 cuenta' : `${n} cuentas`)"
          placeholder="Buscar cuenta o código EC"
          :width="340"
        />
        <p class="story-note">Value: <code>{{ JSON.stringify(state.value) }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstButtonGroup v-model="state.display" title="display" :options="['chips', 'count']" />
        <HstNumber v-model="state.maxChips" title="maxChips" :min="1" />
        <HstText v-model="state.error" title="error" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxMultiSelect

**Several options** from a list, found by typing. For filters ("these accounts", "these document
types") and assignments.

```vue
<TxMultiSelect
  v-model="filtro.cuentas"
  :options="cuentas"
  label="Cuentas"
  :count-label="(n) => `${n} cuentas`"
/>
```

## How it works

- **Typing filters** by each word, accent-insensitive, also in the description (the EC code).
- The list **stays open** while you choose; each option has its checkbox (the check mark draws in).
- Above the list: **Seleccionar todos (n)** (select all), or while searching, **Seleccionar los n
  encontrados** (select the n found); and the `4 / 7` counter.
- The chosen options show as **chips**, each with its ×. Past `maxChips`, the rest fold into
  **+N** (hovering it says which). <kbd>Backspace</kbd> with an empty search removes the last
  one. The field's × removes them all.
- `display="count"` shows "4 cuentas" instead of chips: for a one-line filter bar.
- Options with `group` are listed under their heading; with `description`, on a second line.

| Prop | Type | Default | |
|---|---|---|---|
| `modelValue` | `string[]` | `[]` | |
| `options` | `Option[]` | | `{ value, label, description?, group?, keywords?, disabled? }` |
| `display` | `chips \| count` | `chips` | |
| `maxChips` | `number` | `3` | |
| `countLabel` | `(n) => string` | `"n seleccionados"` | Screen readers hear it too |
| `allLabel` | `string` | `"Todos"` | In `count`, when all are selected |
| `hideActions` | `boolean` | `false` | No "select all" |
| `filter` | `(option, query) => boolean` | by words | |
| `label`, `description`, `error`, `placeholder`, `width`, `inline`, `disabled`, `required` | | | |

**Slot:** `option` — how each option is drawn.
</docs>
