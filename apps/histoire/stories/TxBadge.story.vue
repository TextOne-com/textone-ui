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
        <HstText v-model="state.label" title="Texto" />
        <HstSelect v-model="state.tone" title="tone" :options="['neutral', 'brand', 'info', 'success', 'warning', 'danger']" />
      </template>
    </Variant>
    <Variant title="Tonos">
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

Un estado en una palabra — el chip del sitio: píldora, negrita, el `-700` del tono sobre su `-50`
(todos AA).

```vue
<TxBadge tone="success">Aprobada</TxBadge>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `tone` | `neutral \| brand \| info \| success \| warning \| danger` | `neutral` |

**Slot:** la palabra. Siempre lleva una: el color solo nunca es el mensaje.

| Tono | Úsalo para |
|---|---|
| `neutral` | Estados que no piden nada (retirado, inactivo) |
| `brand` | Distinciones de la marca (negociado, novedad) |
| `info` | Pendiente, en curso |
| `success` | Aprobado, registrado |
| `warning` | Requiere atención, suspendido |
| `danger` | Cerrado, rechazado, negativo |

El estado normal no lleva chip: una cuenta "Activa" se escribe en texto secundario y solo las
excepciones resaltan.
</docs>
