<script setup lang="ts">
import { useId } from "vue";

defineOptions({ inheritAttrs: false });
defineProps<{ label: string; description?: string; disabled?: boolean }>();
const model = defineModel<boolean>({ default: false });
const id = useId();
</script>

<template>
  <div class="tx-checkbox" :class="$attrs.class">
    <input
      :id="id"
      v-model="model"
      type="checkbox"
      class="tx-checkbox__input"
      :disabled="disabled"
      v-bind="{ ...$attrs, class: undefined }"
    />
    <label :for="id" class="tx-checkbox__label">
      {{ label }}
      <span v-if="description" class="tx-field__description">{{ description }}</span>
    </label>
  </div>
</template>
