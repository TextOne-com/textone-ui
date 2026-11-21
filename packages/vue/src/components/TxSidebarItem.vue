<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from "reka-ui";
import { type Component, computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { sidebarKey } from "../internal/sidebar";

/**
 * One destination: an icon (the `icon` slot — Tabler, 2px stroke), a title and an optional
 * count. Pass `as` (RouterLink, "a") and its attributes (`to`, `href`) to make it navigate.
 * Collapsed, the title stays in the accessible name and shows as a tooltip (toggle behaviour);
 * choosing an item closes a hover sidebar. A changed count
 * pulses once, so new work is noticed without anything blinking forever.
 */
// The root is the tooltip, which renders no element: `to`, `href` and the rest go on the link.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label: string;
    active?: boolean;
    as?: string | Component;
    badge?: number | string;
    /** Read to screen readers after the title: "2 pendientes". */
    badgeLabel?: string;
  }>(),
  { as: "a" },
);

const ctx = inject(sidebarKey, null);
const collapsed = computed(() => ctx?.collapsed.value ?? false);
const tooltip = computed(() => collapsed.value && (ctx?.tooltips.value ?? true));
const el = ref<HTMLElement | { $el: HTMLElement }>();
const element = () => {
  const value = el.value;
  return value instanceof HTMLElement ? value : (value?.$el ?? null);
};

watch(
  () => props.active,
  (active) => {
    if (active) queueMicrotask(() => ctx?.setActive(element()));
  },
  { immediate: true, flush: "post" },
);
onBeforeUnmount(() => {
  if (props.active) ctx?.setActive(null);
});

const showBadge = computed(
  () => props.badge !== undefined && props.badge !== null && props.badge !== "" && props.badge !== 0,
);
const pulse = ref(false);
watch(
  () => props.badge,
  (now, before) => {
    if (before === undefined || now === before || !showBadge.value) return;
    pulse.value = false;
    requestAnimationFrame(() => {
      pulse.value = true;
      setTimeout(() => (pulse.value = false), 900);
    });
  },
);
</script>

<template>
  <TooltipRoot :disabled="!tooltip">
    <TooltipTrigger as-child>
      <component
        :is="as"
        ref="el"
        class="tx-sidebar__item"
        :data-active="active || undefined"
        :aria-current="active ? 'page' : undefined"
        v-bind="$attrs"
        @click="ctx?.onSelect()"
      >
        <span class="tx-sidebar__icon" aria-hidden="true"><slot name="icon" /></span>
        <span class="tx-sidebar__label">{{ label }}</span>
        <span v-if="showBadge" class="tx-sidebar__badge" :data-pulse="pulse || undefined" aria-hidden="true">
          {{ badge }}
        </span>
        <span v-if="showBadge && badgeLabel" class="tx-visually-hidden">, {{ badgeLabel }}</span>
      </component>
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent side="right" :side-offset="10" class="tx-tooltip">
        {{ label }}<template v-if="showBadge"> · {{ badge }}</template>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
