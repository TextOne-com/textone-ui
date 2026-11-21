<script setup lang="ts">
import { TxSkeleton } from "@textone-com/vue";
</script>

<template>
  <Story title="TxSkeleton" group="estados">
    <Variant title="Table"><div class="story-pad"><TxSkeleton variant="table" :rows="6" /></div></Variant>
    <Variant title="Cards"><div class="story-pad"><TxSkeleton variant="cards" /></div></Variant>
    <Variant title="Text"><div class="story-pad"><TxSkeleton variant="text" :lines="4" /></div></Variant>
    <Variant title="Block"><div class="story-pad"><TxSkeleton variant="block" height="160px" /></div></Variant>
  </Story>
</template>

<docs lang="md">
# TxSkeleton

A placeholder **shaped like what is loading**, so the page doesn't jump when the data arrives. A
soft light sweeps across it (still under *reduce motion*). Screen readers hear `label`
("Cargando…"), not the pieces.

| Prop | Type | Default | |
|---|---|---|---|
| `variant` | `table \| cards \| text \| block` | `table` | |
| `rows`, `columns` | `number` | `8`, `5` | `table` |
| `cards` | `number` | `4` | `cards` |
| `lines` | `number` | `3` | `text` |
| `width`, `height` | `string` | `100%`, `120px` | `block` |
| `label` | `string` | `"Cargando…"` | |
</docs>
