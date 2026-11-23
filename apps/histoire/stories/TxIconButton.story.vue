<script setup lang="ts">
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-vue";
import { TxIconButton } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  label: "Quitar línea",
  variant: "subtle" as "subtle" | "default" | "filled" | "danger" | "positive" | "negative",
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
        <HstText v-model="state.label" title="label (accessible name)" />
        <HstSelect v-model="state.variant" title="variant" :options="['subtle', 'default', 'filled', 'danger', 'positive', 'negative']" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
    <Variant title="Variants">
      <div class="story-pad" style="align-items: center">
        <TxIconButton label="Quitar línea"><IconX stroke="2" /></TxIconButton>
        <TxIconButton label="Editar" variant="default"><IconPencil stroke="2" /></TxIconButton>
        <TxIconButton label="Eliminar" variant="danger"><IconTrash stroke="2" /></TxIconButton>
        <TxIconButton label="Cerrar" variant="filled"><IconX stroke="2" /></TxIconButton>
      </div>
    </Variant>
    <Variant title="A decision (approve / reject)">
      <div class="story-pad" style="align-items: center">
        <TxIconButton label="Aprobar" variant="positive"><IconCheck stroke="2" /></TxIconButton>
        <TxIconButton label="Rechazar" variant="negative"><IconX stroke="2" /></TxIconButton>
        <TxIconButton label="Aprobar" variant="positive" size="md"><IconCheck stroke="2" /></TxIconButton>
        <TxIconButton label="Rechazar" variant="negative" size="md"><IconX stroke="2" /></TxIconButton>
        <TxIconButton label="Aprobar" variant="positive" disabled><IconCheck stroke="2" /></TxIconButton>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxIconButton

An icon-only button. **`label` is required**: it is its accessible name and its tooltip.

```vue
<TxIconButton label="Quitar línea" @click="remove(line)">
  <IconX stroke="2" />
</TxIconButton>
```

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (required) | — |
| `variant` | `subtle \| default \| filled \| danger \| positive \| negative` | `subtle` |
| `size` | `xs \| sm \| md` | `sm` (28 px) |
| `disabled` | `boolean` | `false` |
| `type` | `button \| submit` | `button` |

**A decision** — `positive` (a check, green) and `negative` (an ×, red), side by side: round,
bordered and tinted, filled on hover. Colour is never the only signal: the icon and the `label`
(Aprobar / Rechazar) say it too.

Icons: **Tabler** (`@tabler/icons-vue`) with `stroke="2"` — a single 2 px line, rounded corners,
no fill (brand manual, slide 14).
</docs>
