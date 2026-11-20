<script setup lang="ts">
import { TxAlert } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  tone: "danger" as "danger" | "success" | "warning" | "info",
  title: "El documento no se registró:",
});
</script>

<template>
  <Story title="TxAlert" group="estados">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxAlert :tone="state.tone" :title="state.title">
          <ul>
            <li>La fecha está fuera de la temporada.</li>
            <li>El SKU no tiene precio para esta cuenta.</li>
          </ul>
        </TxAlert>
      </div>
      <template #controls>
        <HstSelect v-model="state.tone" title="tone" :options="['danger', 'success', 'warning', 'info']" />
        <HstText v-model="state.title" title="title" />
      </template>
    </Variant>
    <Variant title="Tonos">
      <div class="story-col">
        <TxAlert title="El documento no se registró:">La fecha está fuera de la temporada.</TxAlert>
        <TxAlert tone="success">Recibo de caja registrado. <a href="#">Ver la cuenta</a></TxAlert>
        <TxAlert tone="warning">3 SKU tienen existencia negativa.</TxAlert>
        <TxAlert tone="info">Los precios se congelan al registrar.</TxAlert>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxAlert

Un mensaje en caja: un **rechazo** (todas las razones juntas, no una por intento) o una
**confirmación**.

```vue
<TxAlert title="El documento no se registró:">
  <ul><li v-for="r in reasons" :key="r">{{ r }}</li></ul>
</TxAlert>
<TxAlert tone="success">Recibo de caja registrado.</TxAlert>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `tone` | `danger \| success \| warning \| info` | `danger` | |
| `title` | `string` | — | También como slot `title` |
| `role` | `alert \| status \| none` | según el tono | `danger` → `alert`; los demás → `status` |

## Accesibilidad

`role="alert"` se anuncia de inmediato; `status`, con cortesía. Úsalo para lo que acaba de pasar
por una acción de la persona, no para avisos permanentes de la pantalla.
</docs>
