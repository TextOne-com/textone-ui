<script setup lang="ts">
import { TxButton, TxPageHeader } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({ title: "Panel de control", context: "2025 Calendario A · corte al 30/06/2025" });
</script>

<template>
  <Story title="TxPageHeader" group="estructura">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col" style="max-width: 900px">
        <TxPageHeader :title="state.title" :context="state.context || undefined">
          <template #actions>
            <TxButton variant="default">Registrar devolución</TxButton>
            <TxButton>Nueva remisión</TxButton>
          </template>
        </TxPageHeader>
      </div>
      <template #controls>
        <HstText v-model="state.title" title="title" />
        <HstText v-model="state.context" title="context" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxPageHeader

El encabezado de cada pantalla: **título** (H1, Fraunces) a la izquierda, **acciones** a la
derecha, una línea de **contexto** debajo (temporada, corte, cuenta).

```vue
<TxPageHeader title="Panel de control" :context="`${season.name} · corte al ${corte}`">
  <template #actions>
    <TxButton :as="RouterLink" to="/remisiones/nueva">Nueva remisión</TxButton>
  </template>
</TxPageHeader>
```

| Prop / slot | | |
|---|---|---|
| `title` | `string` (requerido) | Un solo H1 por pantalla |
| `context` | `string` | O el slot `context` para algo más rico |
| slot `actions` | | La acción principal al final (a la derecha) |
</docs>
