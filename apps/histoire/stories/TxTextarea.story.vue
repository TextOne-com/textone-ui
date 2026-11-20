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

Texto de varias líneas, con el mismo marco que `TxTextInput`.

```vue
<TxTextarea v-model="notes" label="Observaciones" :rows="2" autosize />
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `label`, `description`, `error`, `placeholder`, `required`, `disabled`, `width`, `id` | | | Como en `TxTextInput` |
| `rows` | `number` | `3` | Alto inicial |
| `autosize` | `boolean` | `false` | Crece con el texto, de `rows` hasta `maxRows` |
| `maxRows` | `number` | `8` | |

**Expone:** `focus()`. Los atributos sueltos (`name`, `aria-*`) van al `<textarea>`.
</docs>
