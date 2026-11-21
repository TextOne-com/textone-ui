<script setup lang="ts">
/**
 * The staff tool's frame: a header across the top, a navigation column on the left, the page.
 * The sidebar shares the canvas; a hairline separates it, not a different colour.
 *
 * Below 768 px (a phone) the column goes away and the `bottombar` slot — a TxBottomNav — is
 * fixed along the bottom instead; the page keeps room for it. The header stays.
 */
/** `navbarWidth: "auto"` lets the navigation size itself (a collapsible TxSidebar). */
withDefaults(defineProps<{ navbarWidth?: number | "auto"; headerHeight?: number }>(), {
  navbarWidth: 232,
  headerHeight: 52,
});
</script>

<template>
  <div
    class="tx-shell"
    :data-bottombar="$slots.bottombar ? '' : undefined"
    :style="{
      '--tx-shell-nav': navbarWidth === 'auto' ? 'auto' : `${navbarWidth}px`,
      '--tx-shell-header': `${headerHeight}px`,
    }"
  >
    <header class="tx-shell__header"><slot name="header" /></header>
    <aside class="tx-shell__navbar"><slot name="navbar" /></aside>
    <main class="tx-shell__main"><slot /></main>
    <div v-if="$slots.bottombar" class="tx-shell__bottombar"><slot name="bottombar" /></div>
  </div>
</template>
