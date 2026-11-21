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
          <p style="margin: 0">Destinos, filtros o un detalle. Escape o el fondo la cierran.</p>
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

Un panel que **entra desde un borde**: el menú completo en el teléfono (`bottom`, con su tirador),
filtros o un detalle al lado de una lista (`left`, `right`). Es modal como TxDialog: el foco
queda adentro, y Escape o el fondo la cierran.

```vue
<TxSheet v-model:open="masAbierto" title="Menú">…</TxSheet>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `title` | `string` | requerido | |
| `side` | `bottom \| left \| right` | `bottom` | |
| `description` | `string` | — | |
| `hideTitle` | `boolean` | `false` | El título queda solo para lectores de pantalla |
</docs>
