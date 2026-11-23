<script setup lang="ts">
/**
 * A password field: TxTextInput with a button that shows what was typed, and a warning while
 * Caps Lock is on. For signing in (`autocomplete="current-password"`) and for choosing a new
 * one (`"new-password"`, so password managers offer to generate and save it).
 */
import { computed, nextTick, ref, useId } from "vue";
import type { Size } from "../internal/types";
import TxTextInput from "./TxTextInput.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    descriptionPosition?: "above" | "below";
    error?: string | boolean | null;
    placeholder?: string;
    size?: Size;
    /** A width in px, or any CSS length. */
    width?: number | string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    id?: string;
    /** `current-password` to sign in, `new-password` to choose one. */
    autocomplete?: "current-password" | "new-password";
    /** The show button. Off where the screen may be watched over a shoulder by policy. */
    revealable?: boolean;
    revealLabel?: string;
    capsLockLabel?: string;
  }>(),
  {
    size: "sm",
    autocomplete: "current-password",
    revealable: true,
    revealLabel: "Mostrar contraseña",
    capsLockLabel: "Bloq Mayús está activado",
  },
);

const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ blur: [FocusEvent]; focus: [FocusEvent]; keydown: [KeyboardEvent] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const field = ref<InstanceType<typeof TxTextInput>>();
const visible = ref(false);
const capsLock = ref(false);
const canReveal = computed(() => props.revealable && !props.disabled);

/** Shows or hides the text and keeps the caret where it was, so typing carries on. */
async function toggle() {
  const input = field.value?.el as HTMLInputElement | undefined;
  const start = input?.selectionStart ?? null;
  const end = input?.selectionEnd ?? null;
  visible.value = !visible.value;
  await nextTick();
  if (!input) return;
  input.focus();
  if (start !== null && end !== null) input.setSelectionRange(start, end);
}

function readCapsLock(event: KeyboardEvent) {
  // Synthetic or very old events have no getModifierState: say nothing rather than guess.
  if (typeof event.getModifierState === "function") capsLock.value = event.getModifierState("CapsLock");
}
function onKeydown(event: KeyboardEvent) {
  readCapsLock(event);
  emit("keydown", event);
}
function onBlur(event: FocusEvent) {
  capsLock.value = false;
  emit("blur", event);
}

defineExpose({ focus: () => field.value?.focus(), el: computed(() => field.value?.el) });
</script>

<template>
  <TxTextInput
    :id="inputId"
    ref="field"
    v-model="model"
    v-bind="$attrs"
    :type="visible ? 'text' : 'password'"
    :label="label"
    :description="description"
    :description-position="descriptionPosition"
    :error="error"
    :placeholder="placeholder"
    :size="size"
    :width="width"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :autocomplete="autocomplete"
    autocapitalize="off"
    autocorrect="off"
    :spellcheck="false"
    @keydown="onKeydown"
    @keyup="readCapsLock"
    @focus="emit('focus', $event)"
    @blur="onBlur"
  >
    <template v-if="canReveal" #right>
      <button
        type="button"
        class="tx-password__toggle"
        :class="`tx-password__toggle--${size}`"
        :aria-label="revealLabel"
        :aria-pressed="visible"
        :aria-controls="inputId"
        :title="revealLabel"
        @click="toggle"
      >
        <svg v-if="visible" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.4 5.4A9.8 9.8 0 0 1 12 5c4.5 0 8 3.5 9.5 7a12 12 0 0 1-2.6 3.7M6.3 6.4A12.5 12.5 0 0 0 2.5 12c1.5 3.5 5 7 9.5 7a9.6 9.6 0 0 0 5.3-1.6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12C4 8.5 7.5 5 12 5s8 3.5 9.5 7c-1.5 3.5-5 7-9.5 7s-8-3.5-9.5-7z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      </button>
    </template>
    <template #after>
      <div class="tx-password__caps" aria-live="polite">
        <Transition name="tx-error">
          <span v-if="capsLock" class="tx-password__caps-text">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4l7 8h-4v4H9v-4H5z" />
              <path d="M9 20h6" />
            </svg>
            {{ capsLockLabel }}
          </span>
        </Transition>
      </div>
    </template>
  </TxTextInput>
</template>
