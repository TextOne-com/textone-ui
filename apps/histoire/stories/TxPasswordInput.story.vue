<script setup lang="ts">
import { TxButton, TxPasswordInput, TxTextInput } from "@textone-com/vue";
import { reactive, ref } from "vue";

const state = reactive({
  value: "",
  label: "Contraseña",
  description: "",
  error: "",
  size: "sm" as "xs" | "sm" | "md",
  autocomplete: "current-password" as "current-password" | "new-password",
  revealable: true,
  disabled: false,
  required: false,
});
const email = ref("auxiliar@textone.com.co");
const password = ref("");
const fresh = ref("");
</script>

<template>
  <Story title="TxPasswordInput" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxPasswordInput
          v-model="state.value"
          :label="state.label"
          :description="state.description || undefined"
          :error="state.error || undefined"
          :size="state.size"
          :autocomplete="state.autocomplete"
          :revealable="state.revealable"
          :disabled="state.disabled"
          :required="state.required"
          :width="320"
        />
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.description" title="description" />
        <HstText v-model="state.error" title="error" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstButtonGroup
          v-model="state.autocomplete"
          title="autocomplete"
          :options="['current-password', 'new-password']"
        />
        <HstCheckbox v-model="state.revealable" title="revealable" />
        <HstCheckbox v-model="state.required" title="required" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>

    <Variant title="Sign in">
      <form class="story-col" style="max-width: 340px" @submit.prevent>
        <TxTextInput v-model="email" label="Correo" type="email" autocomplete="username" size="md" />
        <TxPasswordInput v-model="password" label="Contraseña" size="md" />
        <TxButton type="submit" size="md">Iniciar sesión</TxButton>
      </form>
    </Variant>

    <Variant title="New password">
      <div class="story-col">
        <TxPasswordInput
          v-model="fresh"
          label="Contraseña nueva"
          autocomplete="new-password"
          description="Al menos 12 caracteres. Una frase de varias palabras es fácil de recordar."
          :width="340"
        />
      </div>
    </Variant>

    <Variant title="Error">
      <div class="story-col">
        <TxPasswordInput model-value="no es esta" label="Contraseña" error="Correo o contraseña incorrectos" :width="320" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxPasswordInput

A password field: `TxTextInput` with a button that shows what was typed, and a warning while
Caps Lock is on. Use `v-model` (a `string`).

```vue
<!-- Signing in: the browser and password managers fill it -->
<TxTextInput v-model="email" label="Correo" type="email" autocomplete="username" />
<TxPasswordInput v-model="password" label="Contraseña" />

<!-- Choosing one: managers offer to generate and save it -->
<TxPasswordInput v-model="next" label="Contraseña nueva" autocomplete="new-password" />
```

| Prop | Type | Default | |
|---|---|---|---|
| `label`, `description`, `error`, `size`, `width`, `placeholder` | | | As `TxTextInput` |
| `autocomplete` | `current-password \| new-password` | `current-password` | What the browser offers |
| `revealable` | `boolean` | `true` | The show button |
| `revealLabel` | `string` | `Mostrar contraseña` | The button's name |
| `capsLockLabel` | `string` | `Bloq Mayús está activado` | The warning |
| `disabled`, `readonly`, `required`, `id` | | | Those of the `<input>` |

**Events:** `update:modelValue`, `blur`, `focus`, `keydown`. **Exposes:** `focus()`.

## Behaviour

- The show button switches the input between `password` and `text`, and gives focus back with
  the caret where it was, so typing carries on.
- The Caps Lock warning appears while the key is on and goes when the field loses focus.
- No spell check, autocorrect or capitalisation: a phone keyboard would change what is typed.
- No clear button and no counter: neither helps with a password.

## Accessibility

- The show button is a toggle with one name, "Mostrar contraseña", and `aria-pressed`; it is in
  the tab order and names the input with `aria-controls`.
- The Caps Lock warning is in a polite live region, so a screen reader hears it appear.
- Attributes that are not props (`name`, `data-*`) **go to the `<input>`**; `class` and
  `style`, to the wrapper.
</docs>
