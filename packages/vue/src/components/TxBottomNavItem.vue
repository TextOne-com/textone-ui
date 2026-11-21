<script setup lang="ts">
import { type Component, computed } from "vue";

/**
 * One destination of TxBottomNav: an icon over a short title. `as` and its attributes (`to`)
 * make it navigate; as a button it opens something (the full menu). `primary` raises the one
 * action the app is for into a purple disc. A count shows on the icon.
 */
const props = withDefaults(
  defineProps<{
    label: string;
    active?: boolean;
    as?: string | Component;
    primary?: boolean;
    badge?: number | string;
    badgeLabel?: string;
  }>(),
  { as: "a" },
);
const showBadge = computed(
  () => props.badge !== undefined && props.badge !== null && props.badge !== "" && props.badge !== 0,
);
</script>

<template>
  <component
    :is="as"
    class="tx-bottom-nav__item"
    :data-active="active || undefined"
    :data-primary="primary || undefined"
    :aria-current="active ? 'page' : undefined"
  >
    <span class="tx-bottom-nav__icon" aria-hidden="true">
      <slot name="icon" />
      <span v-if="showBadge" class="tx-bottom-nav__badge">{{ badge }}</span>
    </span>
    <span class="tx-bottom-nav__label">{{ label }}</span>
    <span v-if="showBadge && badgeLabel" class="tx-visually-hidden">, {{ badgeLabel }}</span>
  </component>
</template>
