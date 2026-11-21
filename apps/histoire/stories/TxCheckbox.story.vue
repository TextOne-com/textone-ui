<script setup lang="ts">
import { TxCheckbox } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  checked: true,
  label: "Incluir retirados",
  description: "Muestra también los títulos que ya no se venden.",
  disabled: false,
});
</script>

<template>
  <Story title="TxCheckbox" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxCheckbox v-model="state.checked" :label="state.label" :description="state.description || undefined" :disabled="state.disabled" />
        <p class="story-note">Value: <code>{{ state.checked }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.description" title="description" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCheckbox

A native checkbox with its label (clicking the text also checks it) and an optional description.

```vue
<TxCheckbox v-model="showRetired" label="Incluir retirados" />
```

| Prop | Type | |
|---|---|---|
| `label` | `string` (required) | |
| `description` | `string` | Below the label |
| `disabled` | `boolean` | |

It is a real `<input type="checkbox">`: keyboard, forms and screen readers work with nothing
extra. The brand color reaches it through `accent-color`.
</docs>
