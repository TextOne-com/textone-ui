<script setup lang="ts">
/**
 * The staff tool's frame: a header across the top, a navigation column on the left, the page.
 * The sidebar shares the canvas; a hairline separates it, not a different colour.
 */
withDefaults(defineProps<{ navbarWidth?: number; headerHeight?: number }>(), {
  navbarWidth: 232,
  headerHeight: 52,
});
</script>

<template>
  <div
    class="tx-shell"
    :style="{ '--tx-shell-nav': `${navbarWidth}px`, '--tx-shell-header': `${headerHeight}px` }"
  >
    <header class="tx-shell__header"><slot name="header" /></header>
    <aside class="tx-shell__navbar"><slot name="navbar" /></aside>
    <main class="tx-shell__main"><slot /></main>
  </div>
</template>
