<script setup lang="ts">
/**
 * A titled group of sidebar items. Collapsed, the title becomes a hairline in the same space,
 * so nothing below it moves.
 */
defineProps<{ label: string }>();
</script>

<template>
  <div class="tx-sidebar__group" role="group" :aria-label="label">
    <div class="tx-sidebar__group-label" aria-hidden="true">
      <span>{{ label }}</span>
    </div>
    <slot />
  </div>
</template>
