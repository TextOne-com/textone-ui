<script setup lang="ts">
/**
 * A message in a box: a refusal (danger, role alert) or a confirmation (success, role status).
 * A word and a tone, never a banner.
 */
withDefaults(
  defineProps<{
    tone?: "danger" | "success" | "warning" | "info";
    title?: string;
    role?: "alert" | "status" | "none";
  }>(),
  { tone: "danger" },
);
</script>

<template>
  <div
    class="tx-alert"
    :class="`tx-alert--${tone}`"
    :role="role === 'none' ? undefined : (role ?? (tone === 'danger' ? 'alert' : 'status'))"
  >
    <div v-if="title || $slots.title" class="tx-alert__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="tx-alert__body"><slot /></div>
  </div>
</template>
