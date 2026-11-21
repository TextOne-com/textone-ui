<script setup lang="ts">
import { TxSkeleton } from "@textone-com/vue";
</script>

<template>
  <Story title="TxSkeleton" group="estados">
    <Variant title="Tabla"><div class="story-pad"><TxSkeleton variant="table" :rows="6" /></div></Variant>
    <Variant title="Tarjetas"><div class="story-pad"><TxSkeleton variant="cards" /></div></Variant>
    <Variant title="Texto"><div class="story-pad"><TxSkeleton variant="text" :lines="4" /></div></Variant>
    <Variant title="Bloque"><div class="story-pad"><TxSkeleton variant="block" height="160px" /></div></Variant>
  </Story>
</template>

<docs lang="md">
# TxSkeleton

Un marcador **con la forma de lo que está cargando**, así la página no salta cuando llegan los
datos. Una luz suave lo recorre (quieta con *reducir movimiento*). Los lectores de pantalla oyen
`label` ("Cargando…"), no las piezas.

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `variant` | `table \| cards \| text \| block` | `table` | |
| `rows`, `columns` | `number` | `8`, `5` | `table` |
| `cards` | `number` | `4` | `cards` |
| `lines` | `number` | `3` | `text` |
| `width`, `height` | `string` | `100%`, `120px` | `block` |
| `label` | `string` | `"Cargando…"` | |
</docs>
