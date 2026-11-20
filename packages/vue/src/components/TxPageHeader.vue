<script setup lang="ts">
/** Title on the left, actions on the right, a line of context beneath (`context` or slot). */
defineProps<{ title: string; context?: string }>();
</script>

<template>
  <header class="tx-page-header">
    <div>
      <h1 class="tx-title tx-title--1">{{ title }}</h1>
      <p v-if="context || $slots.context" class="tx-page-header__context">
        <slot name="context">{{ context }}</slot>
      </p>
    </div>
    <div v-if="$slots.actions" class="tx-page-header__actions"><slot name="actions" /></div>
  </header>
</template>
