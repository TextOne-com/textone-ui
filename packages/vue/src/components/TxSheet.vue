<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from "reka-ui";

/**
 * A panel that slides in from an edge: the full navigation on a phone (`bottom`), filters or a
 * detail beside a list (`right`, `left`). A modal like TxDialog — focus stays inside, Escape and
 * the overlay close it — with a grab handle on the bottom sheet. `hideTitle` keeps the title
 * for screen readers only.
 */
withDefaults(
  defineProps<{
    title: string;
    side?: "bottom" | "left" | "right";
    description?: string;
    hideTitle?: boolean;
    closeLabel?: string;
  }>(),
  { side: "bottom", closeLabel: "Cerrar" },
);
const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="tx-sheet__overlay" />
      <DialogContent class="tx-sheet" :data-side="side">
        <span v-if="side === 'bottom'" class="tx-sheet__handle" aria-hidden="true" />
        <header class="tx-sheet__header" :data-hidden="hideTitle || undefined">
          <VisuallyHidden v-if="hideTitle" as-child><DialogTitle>{{ title }}</DialogTitle></VisuallyHidden>
          <DialogTitle v-else class="tx-sheet__title">{{ title }}</DialogTitle>
          <DialogClose class="tx-icon-button tx-icon-button--subtle tx-icon-button--md" :aria-label="closeLabel">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </DialogClose>
        </header>
        <DialogDescription v-if="description" class="tx-sheet__description">{{ description }}</DialogDescription>
        <div class="tx-sheet__body"><slot :close="() => (open = false)" /></div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
