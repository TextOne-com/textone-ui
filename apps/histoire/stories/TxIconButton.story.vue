<script setup lang="ts">
import { IconPencil, IconTrash, IconX } from "@tabler/icons-vue";
import { TxIconButton } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  label: "Quitar línea",
  variant: "subtle" as "subtle" | "default" | "filled" | "danger",
  size: "sm" as "xs" | "sm" | "md",
  disabled: false,
});
</script>

<template>
  <Story title="TxIconButton" group="acciones">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-pad">
        <TxIconButton :label="state.label" :variant="state.variant" :size="state.size" :disabled="state.disabled">
          <IconX stroke="2" />
        </TxIconButton>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label (nombre accesible)" />
        <HstSelect v-model="state.variant" title="variant" :options="['subtle', 'default', 'filled', 'danger']" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
    <Variant title="Variantes">
      <div class="story-pad" style="align-items: center">
        <TxIconButton label="Quitar línea"><IconX stroke="2" /></TxIconButton>
        <TxIconButton label="Editar" variant="default"><IconPencil stroke="2" /></TxIconButton>
        <TxIconButton label="Eliminar" variant="danger"><IconTrash stroke="2" /></TxIconButton>
        <TxIconButton label="Cerrar" variant="filled"><IconX stroke="2" /></TxIconButton>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxIconButton

Un botón solo con ícono. **`label` es obligatorio**: es su nombre accesible y su tooltip.

```vue
<TxIconButton label="Quitar línea" @click="remove(line)">
  <IconX stroke="2" />
</TxIconButton>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `label` | `string` (requerido) | — |
| `variant` | `subtle \| default \| filled \| danger` | `subtle` |
| `size` | `xs \| sm \| md` | `sm` (28 px) |
| `disabled` | `boolean` | `false` |
| `type` | `button \| submit` | `button` |

Íconos: **Tabler** (`@tabler/icons-vue`) con `stroke="2"` — línea simple de 2 px, esquinas
redondeadas, sin relleno (manual, diapositiva 14).
</docs>
