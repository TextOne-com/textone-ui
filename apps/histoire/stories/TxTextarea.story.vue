<script setup lang="ts">
import { TxTextarea } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  value: "",
  label: "Motivo",
  description: "Por qué se pide la nota crédito.",
  error: "",
  rows: 2,
  autosize: true,
  required: false,
});
</script>

<template>
  <Story title="TxTextarea" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxTextarea
          v-model="state.value"
          :label="state.label"
          :description="state.description || undefined"
          :error="state.error || undefined"
          :rows="state.rows"
          :autosize="state.autosize"
          :required="state.required"
          placeholder="Escriba varias líneas para ver cómo crece…"
        />
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.description" title="description" />
        <HstText v-model="state.error" title="error" />
        <HstSlider v-model="state.rows" title="rows" :min="1" :max="8" />
        <HstCheckbox v-model="state.autosize" title="autosize" />
        <HstCheckbox v-model="state.required" title="required" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxTextarea

Multi-line text, with the same frame as `TxTextInput`.

```vue
<TxTextarea v-model="notes" label="Observaciones" :rows="2" autosize />
```

| Prop | Type | Default | |
|---|---|---|---|
| `label`, `description`, `error`, `placeholder`, `required`, `disabled`, `width`, `id` | | | As in `TxTextInput` |
| `rows` | `number` | `3` | Initial height |
| `autosize` | `boolean` | `false` | Grows with the text, from `rows` up to `maxRows` |
| `maxRows` | `number` | `8` | |

**Exposes:** `focus()`. Fallthrough attributes (`name`, `aria-*`) go to the `<textarea>`.
</docs>
