<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { dismissToast, type Toast, toasts } from "../composables/toast";

/**
 * Where `toast()` messages appear: bottom right on a desk, above the bottom bar on a phone.
 * Each stays its `duration` (errors until closed), pauses while hovered or focused, and can be
 * closed. Successes are announced politely, errors at once. Mount one, near the app's root.
 */
withDefaults(defineProps<{ closeLabel?: string; label?: string }>(), {
  closeLabel: "Cerrar aviso",
  label: "Avisos",
});

const timers = new Map<number, { left: number; started: number; handle?: ReturnType<typeof setTimeout> }>();

function start(t: Toast) {
  const state = timers.get(t.id) ?? { left: t.duration, started: 0 };
  if (!t.duration) return;
  state.started = Date.now();
  state.handle = setTimeout(() => dismissToast(t.id), state.left);
  timers.set(t.id, state);
}
function pause(t: Toast) {
  const state = timers.get(t.id);
  if (!state?.handle) return;
  clearTimeout(state.handle);
  state.handle = undefined;
  state.left -= Date.now() - state.started;
}

watch(
  () => toasts.map((t) => t.id),
  (ids) => {
    for (const t of toasts) if (!timers.has(t.id)) start(t as Toast);
    for (const id of [...timers.keys()]) {
      if (!ids.includes(id)) {
        clearTimeout(timers.get(id)?.handle);
        timers.delete(id);
      }
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  for (const s of timers.values()) clearTimeout(s.handle);
});

function act(t: Toast) {
  t.action?.onClick?.();
  dismissToast(t.id);
}
</script>

<template>
  <section class="tx-toaster" :aria-label="label">
    <TransitionGroup name="tx-toast" tag="ol" class="tx-toaster__list">
      <li
        v-for="t in toasts"
        :key="t.id"
        class="tx-toast"
        :data-tone="t.tone"
        :role="t.tone === 'error' ? 'alert' : 'status'"
        :aria-live="t.tone === 'error' ? 'assertive' : 'polite'"
        @mouseenter="pause(t as Toast)"
        @mouseleave="start(t as Toast)"
        @focusin="pause(t as Toast)"
        @focusout="start(t as Toast)"
      >
        <span class="tx-toast__icon" aria-hidden="true">
          <svg v-if="t.tone === 'success'" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          <svg v-else-if="t.tone === 'error'" viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01" /></svg>
          <svg v-else viewBox="0 0 24 24"><path d="M12 11v6M12 7h.01" /></svg>
        </span>
        <div class="tx-toast__body">
          <p class="tx-toast__title">{{ t.title }}</p>
          <p v-if="t.description" class="tx-toast__description">{{ t.description }}</p>
        </div>
        <a
          v-if="t.action?.href"
          class="tx-toast__action"
          :href="t.action.href"
          @click="act(t as Toast)"
        >{{ t.action.label }}</a>
        <button v-else-if="t.action" type="button" class="tx-toast__action" @click="act(t as Toast)">
          {{ t.action.label }}
        </button>
        <button type="button" class="tx-toast__close" :aria-label="closeLabel" @click="dismissToast(t.id)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
        <span
          v-if="t.duration"
          class="tx-toast__timer"
          :style="{ animationDuration: `${t.duration}ms` }"
          aria-hidden="true"
        />
      </li>
    </TransitionGroup>
  </section>
</template>
