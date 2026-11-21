<script setup lang="ts">
/**
 * A phone's main navigation: four or five destinations across the bottom, in thumb reach
 * (TxBottomNavItem). It sits above the home indicator (safe area). Show it only on narrow
 * screens — inside TxAppShell's `bottombar` slot it is.
 */
withDefaults(defineProps<{ label?: string }>(), { label: "Principal" });
</script>

<template>
  <nav class="tx-bottom-nav" :aria-label="label">
    <slot />
  </nav>
</template>
