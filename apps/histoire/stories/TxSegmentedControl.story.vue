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
        <p class="story-note">Value: <code>{{ state.value }}</code></p>
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

**Two to five mutually exclusive options**, side by side: Pendientes / Todas, Conteo / Entrada /
Ajuste. A pill, like the site's chips.

```vue
<TxSegmentedControl
  v-model="tipo"
  label="Tipo de movimiento"
  :options="[{ value: 'conteo', label: 'Conteo' }, { value: 'entrada', label: 'Entrada' }]"
/>
```

| Prop | Type | |
|---|---|---|
| `modelValue` | `string` (required) | |
| `options` | `{ value; label; disabled? }[]` | |
| `label` | `string` | The group's accessible name (not visible) |
| `size` | `xs \| sm` | |
| `disabled` | `boolean` | |

Underneath they are **native radios**: arrow keys to move, a single tab stop, and it is announced
as a `radiogroup`. To switch between views of the same object, use `TxTabs`.
</docs>
