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

Every screen's header: **title** (H1, Fraunces) on the left, **actions** on the right, a
**context** line below (season, cut-off date, account).

```vue
<TxPageHeader title="Panel de control" :context="`${season.name} · corte al ${corte}`">
  <template #actions>
    <TxButton :as="RouterLink" to="/remisiones/nueva">Nueva remisión</TxButton>
  </template>
</TxPageHeader>
```

| Prop / slot | | |
|---|---|---|
| `title` | `string` (required) | A single H1 per screen |
| `context` | `string` | Or the `context` slot for something richer |
| slot `actions` | | The primary action last (on the right) |
</docs>
