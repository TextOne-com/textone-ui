<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from "reka-ui";
import { nextTick, useId, watch } from "vue";

/**
 * A small panel anchored to its trigger: a context switcher, an account menu. The `trigger`
 * slot is the button (rendered as-is, so give it a name); the default slot is the panel.
 * Escape and a click outside close it; focus returns to the trigger.
 */
const props = withDefaults(
  defineProps<{
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    width?: number;
    /** Accessible name of the panel. */
    label?: string;
  }>(),
  { side: "bottom", align: "start", width: 300 },
);
const open = defineModel<boolean>("open", { default: false });

// Reka names the panel after its trigger (aria-labelledby). With `label`, the panel is named by
// it instead: reka sets the attribute itself, so it is replaced once the panel is in the page.
const panelId = useId();
watch(
  open,
  async (isOpen) => {
    if (!isOpen || !props.label) return;
    await nextTick();
    const el = document.querySelector<HTMLElement>(`[data-tx-panel="${panelId}"]`);
    if (!el) return;
    el.removeAttribute("aria-labelledby");
    el.setAttribute("aria-label", props.label);
  },
  { immediate: true, flush: "post" },
);
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child><slot name="trigger" :open="open" /></PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :data-tx-panel="panelId"
        class="tx-popover-panel"
        :side="side"
        :align="align"
        :side-offset="8"
        :collision-padding="12"
        :aria-label="label"
        :style="{ width: `min(${width}px, calc(100vw - 24px))` }"
      >
        <slot :close="() => (open = false)" />
        <PopoverArrow class="tx-popover__arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
