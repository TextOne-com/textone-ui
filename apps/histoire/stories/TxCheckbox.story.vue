<script setup lang="ts">
import { TxCheckbox } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  checked: true,
  label: "Incluir retirados",
  description: "Muestra también los títulos que ya no se venden.",
  disabled: false,
});
</script>

<template>
  <Story title="TxCheckbox" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxCheckbox v-model="state.checked" :label="state.label" :description="state.description || undefined" :disabled="state.disabled" />
        <p class="story-note">Valor: <code>{{ state.checked }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.description" title="description" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCheckbox

Una casilla nativa con su etiqueta (clic en el texto también la marca) y una descripción opcional.

```vue
<TxCheckbox v-model="showRetired" label="Incluir retirados" />
```

| Prop | Tipo | |
|---|---|---|
| `label` | `string` (requerido) | |
| `description` | `string` | Debajo de la etiqueta |
| `disabled` | `boolean` | |

Es un `<input type="checkbox">` real: teclado, formularios y lectores de pantalla funcionan sin
nada extra. El color de la marca le llega por `accent-color`.
</docs>
