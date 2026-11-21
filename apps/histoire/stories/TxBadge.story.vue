<script setup lang="ts">
import { TxBadge } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  label: "Pendiente",
  tone: "info" as "neutral" | "brand" | "info" | "success" | "warning" | "danger",
});
</script>

<template>
  <Story title="TxBadge" group="estados">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-pad"><TxBadge :tone="state.tone">{{ state.label }}</TxBadge></div>
      <template #controls>
        <HstText v-model="state.label" title="Text" />
        <HstSelect v-model="state.tone" title="tone" :options="['neutral', 'brand', 'info', 'success', 'warning', 'danger']" />
      </template>
    </Variant>
    <Variant title="Tones">
      <div class="story-pad">
        <TxBadge>Retirado</TxBadge>
        <TxBadge tone="brand">Negociado</TxBadge>
        <TxBadge tone="info">Pendiente</TxBadge>
        <TxBadge tone="success">Aprobada</TxBadge>
        <TxBadge tone="warning">Suspendida</TxBadge>
        <TxBadge tone="danger">Cerrada</TxBadge>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxBadge

A status in one word — the site's chip: a pill, bold, the tone's `-700` on its `-50`
(all AA).

```vue
<TxBadge tone="success">Aprobada</TxBadge>
```

| Prop | Type | Default |
|---|---|---|
| `tone` | `neutral \| brand \| info \| success \| warning \| danger` | `neutral` |

**Slot:** the word. Always include one: color alone is never the message.

| Tone | Use it for |
|---|---|
| `neutral` | States that ask for nothing (retired, inactive) |
| `brand` | Brand distinctions (negotiated, new) |
| `info` | Pending, in progress |
| `success` | Approved, recorded |
| `warning` | Needs attention, suspended |
| `danger` | Closed, rejected, negative |

The normal state gets no chip: an "Activa" (active) account is written in secondary text and only
the exceptions stand out.
</docs>
