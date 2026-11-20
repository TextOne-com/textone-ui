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
        <p class="story-note">Valor: <code>{{ JSON.stringify(state.value) }}</code></p>
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

    <Variant title="Dinero (slot left, figures)">
      <div class="story-col">
        <TxTextInput v-model="amount" label="Valor recibido" description="Como se escribe en Colombia: 1.250.000,50" align="right" figures :width="240">
          <template #left><span class="tx-figures">$</span></template>
        </TxTextInput>
      </div>
    </Variant>

    <Variant title="Búsqueda sin etiqueta visible">
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

Un campo de texto con su etiqueta, descripción y error. Usa `v-model` (siempre `string`).

```vue
<TxTextInput v-model="form.reference" label="Número del recibo de caja" required />

<!-- Sin etiqueta visible: aria-label va al <input>, class/style al contenedor -->
<TxTextInput v-model="q" aria-label="Buscar" placeholder="Buscar" class="w-72" />
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `label` | `string` | — | Arriba del campo |
| `description` | `string` | — | Ayuda; `descriptionPosition: "below"` la pone debajo |
| `error` | `string \| boolean` | — | Texto bajo el campo, o solo el borde rojo con `true` |
| `size` | `xs \| sm \| md` | `sm` | 26 / 32 / 40 px |
| `align` | `left \| right` | `left` | `right` para cifras |
| `figures` | `boolean` | `false` | Cifras tabulares |
| `width` | `number \| string` | — | px o cualquier medida CSS |
| `type`, `placeholder`, `disabled`, `readonly`, `required`, `id` | | | Los del `<input>` |

**Slots:** `left`, `right` (íconos, `$`), `after` (bajo el campo).
**Eventos:** `update:modelValue`, `blur`, `focus`, `keydown`. **Expone:** `focus()`.

## Accesibilidad

- La etiqueta está enlazada al `<input>` (`for`/`id`); la descripción y el error, por
  `aria-describedby`. Con error, `aria-invalid="true"`.
- Los atributos que no son props (`aria-label`, `name`, `inputmode`, `data-*`) **van al
  `<input>`**; `class` y `style`, al contenedor.
</docs>
