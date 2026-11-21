<script setup lang="ts">
import { TxAvatar } from "@textone-com/vue";
</script>

<template>
  <Story title="TxAvatar" group="documento">
    <Variant title="Tamaños y vacío">
      <div class="story-pad" style="display: flex; gap: 16px; align-items: center">
        <TxAvatar name="Aprobador local" :size="24" />
        <TxAvatar name="Auxiliar local" :size="32" />
        <TxAvatar name="Bodega" :size="40" />
        <TxAvatar :size="40" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxAvatar

Una persona como **sus iniciales** en un círculo morado: primera y última palabra
("Aprobador local" → AL). Sin nombre, un contorno vacío: "nadie elegido". Es decorativo; el
nombre va en el texto de al lado.

| Prop | Tipo | Por defecto |
|---|---|---|
| `name` | `string \| null` | — |
| `size` | `number` | `32` |
</docs>
