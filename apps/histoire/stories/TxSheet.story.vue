<script setup lang="ts">
import { TxButton, TxSheet } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({ open: false, side: "bottom" as "bottom" | "left" | "right" });
</script>

<template>
  <Story title="TxSheet" group="estructura">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-pad">
        <TxButton @click="state.open = true">Abrir hoja</TxButton>
        <TxSheet v-model:open="state.open" title="Menú" :side="state.side">
          <p style="margin: 0">Destinations, filters or a detail. Escape or the backdrop closes it.</p>
          <TxButton variant="subtle" @click="state.open = false">Cerrar</TxButton>
        </TxSheet>
      </div>
      <template #controls>
        <HstButtonGroup v-model="state.side" title="side" :options="['bottom', 'left', 'right']" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxSheet

A panel that **slides in from an edge**: the full menu on the phone (`bottom`, with its handle),
filters or a detail next to a list (`left`, `right`). It is modal like TxDialog: focus stays
inside, and Escape or the backdrop closes it.

```vue
<TxSheet v-model:open="masAbierto" title="Menú">…</TxSheet>
```

| Prop | Type | Default | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `title` | `string` | required | |
| `side` | `bottom \| left \| right` | `bottom` | |
| `description` | `string` | — | |
| `hideTitle` | `boolean` | `false` | The title is kept for screen readers only |
</docs>
