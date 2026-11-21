<script setup lang="ts">
/**
 * The frame every control sits in: label above, description beneath it, the control, the error
 * last. The control receives `id`, and `describedBy` names the description and the error, so a
 * screen reader reads them with the field.
 */
defineProps<{
  id: string;
  label?: string;
  description?: string;
  error?: string | boolean | null;
  required?: boolean;
  /** For a group of radios: the label names a fieldset legend, not one control. */
  as?: "div" | "fieldset";
  /** Help text above the control (default) or beneath it, before the error. */
  descriptionPosition?: "above" | "below";
}>();
</script>

<template>
  <component :is="as ?? 'div'" class="tx-field" :role="as === 'fieldset' ? 'radiogroup' : undefined" :aria-labelledby="as === 'fieldset' && label ? `${id}-label` : undefined">
    <label v-if="label && as !== 'fieldset'" :id="`${id}-label`" :for="id" class="tx-field__label">
      {{ label }}<span v-if="required" class="tx-field__required" aria-hidden="true"> *</span>
    </label>
    <span v-else-if="label" :id="`${id}-label`" class="tx-field__label">{{ label }}</span>
    <div
      v-if="description && descriptionPosition !== 'below'"
      :id="`${id}-description`"
      class="tx-field__description"
    >
      {{ description }}
    </div>
    <slot />
    <div
      v-if="description && descriptionPosition === 'below'"
      :id="`${id}-description`"
      class="tx-field__description tx-field__description--below"
    >
      {{ description }}
    </div>
    <Transition name="tx-error">
      <div v-if="error && typeof error === 'string'" :id="`${id}-error`" class="tx-field__error" role="alert">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4.5M12 16h.01" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </Transition>
  </component>
</template>
