<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui";

/** A modal decision: a title, the body, the actions in `footer`. Escape and × close it. */
const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    width?: number;
    closeLabel?: string;
    /** A CSS selector inside the dialog to focus on open (e.g. the note field), not the ×. */
    initialFocus?: string;
  }>(),
  { width: 460, closeLabel: "Cerrar" },
);
const open = defineModel<boolean>("open", { default: false });

function onOpenAutoFocus(event: Event) {
  if (!props.initialFocus) return;
  const content = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  const target = (content ?? document).querySelector<HTMLElement>(props.initialFocus);
  if (target) {
    event.preventDefault();
    target.focus();
  }
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="tx-dialog__overlay" />
      <DialogContent
        class="tx-dialog"
        :style="{ width: `min(${width}px, calc(100vw - 32px))` }"
        @open-auto-focus="onOpenAutoFocus"
      >
        <header class="tx-dialog__header">
          <DialogTitle class="tx-dialog__title">{{ title }}</DialogTitle>
          <DialogClose class="tx-icon-button tx-icon-button--subtle tx-icon-button--sm" :aria-label="closeLabel">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </DialogClose>
        </header>
        <DialogDescription v-if="description" class="tx-dialog__description">
          {{ description }}
        </DialogDescription>
        <div class="tx-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" class="tx-dialog__footer"><slot name="footer" /></footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
