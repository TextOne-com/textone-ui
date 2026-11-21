<script setup lang="ts">
import { computed } from "vue";

/**
 * A person, as their initials in a purple disc (no photos in a staff tool). With no name it
 * shows an empty outline — "nobody chosen yet". The name itself is for the text beside it;
 * the disc is decorative.
 */
const props = withDefaults(defineProps<{ name?: string | null; size?: number }>(), { size: 32 });

const initials = computed(() => {
  const words = (props.name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toLocaleUpperCase("es");
});
</script>

<template>
  <span
    class="tx-avatar"
    :data-empty="!initials || undefined"
    :style="{ '--tx-avatar-size': `${size}px` }"
    aria-hidden="true"
  >
    <template v-if="initials">{{ initials }}</template>
    <svg v-else viewBox="0 0 24 24" width="60%" height="60%">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </span>
</template>
