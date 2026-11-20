<script setup lang="ts">
import { TxSegmentedControl } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({ value: "conteo", size: "sm" as "xs" | "sm" | "md", disabled: false });
</script>

<template>
  <Story title="TxSegmentedControl" group="seleccion">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxSegmentedControl
          v-model="state.value"
          label="Tipo de movimiento"
          :size="state.size"
          :disabled="state.disabled"
          :options="[
            { value: 'conteo', label: 'Conteo' },
            { value: 'entrada', label: 'Entrada' },
            { value: 'ajuste', label: 'Ajuste' },
          ]"
        />
        <p class="story-note">Valor: <code>{{ state.value }}</code></p>
      </div>
      <template #controls>
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm']" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxSegmentedControl

De **dos a cinco opciones excluyentes**, una al lado de la otra: Pendientes / Todas, Conteo /
Entrada / Ajuste. Píldora, como los chips del sitio.

```vue
<TxSegmentedControl
  v-model="tipo"
  label="Tipo de movimiento"
  :options="[{ value: 'conteo', label: 'Conteo' }, { value: 'entrada', label: 'Entrada' }]"
/>
```

| Prop | Tipo | |
|---|---|---|
| `modelValue` | `string` (requerido) | |
| `options` | `{ value; label; disabled? }[]` | |
| `label` | `string` | Nombre accesible del grupo (no se ve) |
| `size` | `xs \| sm` | |
| `disabled` | `boolean` | |

Por dentro son **radios nativos**: flechas para moverse, un solo punto de tabulación, y se anuncia
como `radiogroup`. Para cambiar de vista de un mismo objeto, usa `TxTabs`.
</docs>
