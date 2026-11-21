<script setup lang="ts">
import { TxMultiSelect } from "@textone-com/vue";
import { reactive } from "vue";

// Ficticios: nada de distribuidores reales en una página pública.
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
        <p class="story-note">Valor: <code>{{ JSON.stringify(state.value) }}</code></p>
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

**Varias opciones** de una lista, encontradas escribiendo. Para filtros ("estas cuentas", "estos
tipos de documento") y asignaciones.

```vue
<TxMultiSelect
  v-model="filtro.cuentas"
  :options="cuentas"
  label="Cuentas"
  :count-label="(n) => `${n} cuentas`"
/>
```

## Cómo se usa

- **Escribir filtra** por cada palabra, sin tildes, también en la descripción (el código EC).
- La lista **queda abierta** mientras eliges; cada opción con su casilla (el visto se dibuja).
- Arriba de la lista: **Seleccionar todos (n)**, o mientras buscas, **Seleccionar los n
  encontrados**; y el contador `4 / 7`.
- Lo elegido queda como **chips**, cada uno con su ×. Pasados `maxChips`, el resto se pliega en
  **+N** (al pasar el mouse dice cuáles). <kbd>Backspace</kbd> con la búsqueda vacía quita el
  último. El × del campo quita todos.
- `display="count"` muestra "4 cuentas" en vez de chips: para una barra de filtros de una línea.
- Opciones con `group` se listan bajo su título; con `description`, en una segunda línea.

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `string[]` | `[]` | |
| `options` | `Option[]` | | `{ value, label, description?, group?, keywords?, disabled? }` |
| `display` | `chips \| count` | `chips` | |
| `maxChips` | `number` | `3` | |
| `countLabel` | `(n) => string` | `"n seleccionados"` | También lo oye el lector de pantalla |
| `allLabel` | `string` | `"Todos"` | En `count`, cuando están todos |
| `hideActions` | `boolean` | `false` | Sin "seleccionar todos" |
| `filter` | `(option, query) => boolean` | por palabras | |
| `label`, `description`, `error`, `placeholder`, `width`, `inline`, `disabled`, `required` | | | |

**Slot:** `option` — cómo se dibuja cada opción.
</docs>
