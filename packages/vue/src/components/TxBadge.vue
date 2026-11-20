<script setup lang="ts">
import type { Tone } from "../internal/types";

/**
 * A state in a word: -700 text on its -50 tint (measured AA). Colour means state, and state
 * always has a word — the slot is the label.
 */
withDefaults(defineProps<{ tone?: Tone }>(), { tone: "neutral" });
</script>

<template>
  <span class="tx-badge" :class="`tx-badge--${tone}`"><slot /></span>
</template>
