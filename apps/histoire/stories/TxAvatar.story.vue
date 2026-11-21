<script setup lang="ts">
import { TxAvatar } from "@textone-com/vue";
</script>

<template>
  <Story title="TxAvatar" group="documento">
    <Variant title="Sizes and empty">
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

A person as **their initials** in a purple circle: first and last word
("Aprobador local" → AL). With no name, an empty outline: "nobody chosen". It is decorative; the
name goes in the text next to it.

| Prop | Type | Default |
|---|---|---|
| `name` | `string \| null` | — |
| `size` | `number` | `32` |
</docs>
