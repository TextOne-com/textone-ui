<script setup lang="ts">
import { IconSearch } from "@tabler/icons-vue";
import { TxTextInput } from "@textone-com/vue";
import { reactive, ref } from "vue";

const state = reactive({
  value: "",
  label: "Número del recibo de caja",
  description: "",
  error: "",
  placeholder: "RC-0001",
  size: "sm" as "xs" | "sm" | "md",
  align: "left" as "left" | "right",
  disabled: false,
  required: false,
  figures: false,
});
const amount = ref("125.000,50");
const search = ref("");
</script>

<template>
  <Story title="TxTextInput" group="campos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxTextInput
          v-model="state.value"
          :label="state.label"
          :description="state.description || undefined"
          :error="state.error || undefined"
          :placeholder="state.placeholder"
          :size="state.size"
          :align="state.align"
          :disabled="state.disabled"
          :required="state.required"
          :figures="state.figures"
        />
        <p class="story-note">Value: <code>{{ JSON.stringify(state.value) }}</code></p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.description" title="description" />
        <HstText v-model="state.error" title="error" />
        <HstText v-model="state.placeholder" title="placeholder" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstButtonGroup v-model="state.align" title="align" :options="['left', 'right']" />
        <HstCheckbox v-model="state.required" title="required" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
        <HstCheckbox v-model="state.figures" title="figures" />
      </template>
    </Variant>

    <Variant title="Money (left slot, figures)">
      <div class="story-col">
        <TxTextInput v-model="amount" label="Valor recibido" description="Como se escribe en Colombia: 1.250.000,50" align="right" figures :width="240">
          <template #left><span class="tx-figures">$</span></template>
        </TxTextInput>
      </div>
    </Variant>

    <Variant title="Search without a visible label">
      <div class="story-col">
        <TxTextInput v-model="search" aria-label="Buscar por código o título" placeholder="Buscar por código o título" :width="300">
          <template #left><IconSearch :size="14" stroke="2" aria-hidden="true" /></template>
        </TxTextInput>
      </div>
    </Variant>

    <Variant title="Error">
      <div class="story-col">
        <TxTextInput model-value="1250000.50" label="Valor recibido" error="Escriba el valor en pesos: 1.250.000,50" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxTextInput

A text field with its label, description and error. Use `v-model` (always a `string`).

```vue
<TxTextInput v-model="form.reference" label="Número del recibo de caja" required />

<!-- No visible label: aria-label goes to the <input>, class/style to the wrapper -->
<TxTextInput v-model="q" aria-label="Buscar" placeholder="Buscar" class="w-72" />
```

| Prop | Type | Default | |
|---|---|---|---|
| `label` | `string` | — | Above the field |
| `description` | `string` | — | Help text; `descriptionPosition: "below"` puts it underneath |
| `error` | `string \| boolean` | — | Text under the field, or just the red border with `true` |
| `size` | `xs \| sm \| md` | `sm` | 26 / 32 / 40 px |
| `align` | `left \| right` | `left` | `right` for figures |
| `figures` | `boolean` | `false` | Tabular figures |
| `width` | `number \| string` | — | px or any CSS length |
| `type`, `placeholder`, `disabled`, `readonly`, `required`, `id` | | | Those of the `<input>` |

**Slots:** `left`, `right` (icons, `$`), `after` (under the field).
**Events:** `update:modelValue`, `blur`, `focus`, `keydown`. **Exposes:** `focus()`.

## Accessibility

- The label is linked to the `<input>` (`for`/`id`); the description and the error, through
  `aria-describedby`. With an error, `aria-invalid="true"`.
- Attributes that are not props (`aria-label`, `name`, `inputmode`, `data-*`) **go to the
  `<input>`**; `class` and `style`, to the wrapper.
</docs>
