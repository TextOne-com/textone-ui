<script setup lang="ts">
import { TxCombobox } from "@textone-com/vue";
import { reactive, ref } from "vue";

const titles = [
  { value: "TO-PRE-001", label: "TO-PRE-001 · Mi Mundo Mágico Pre Escolar" },
  { value: "TO-PRI-001", label: "TO-PRI-001 · Lenguaje Mágico 1" },
  { value: "TO-PRI-002", label: "TO-PRI-002 · Lenguaje Mágico 2" },
  { value: "TO-PRI-003", label: "TO-PRI-003 · Matemática Activa 1" },
  { value: "TO-PRI-004", label: "TO-PRI-004 · Matemática Activa 2" },
  { value: "TO-BAC-020", label: "TO-BAC-020 · Viva el arte Novedad (7)", disabled: true },
  { value: "TPE-DIS-001", label: "TPE-DIS-001 · Ciencias Naturales 1", keywords: "distribuciones tpe" },
];
const state = reactive({
  value: null as string | null,
  label: "SKU",
  placeholder: "Código o título",
  clearable: true,
  error: "",
});
const added = ref<string[]>([]);
</script>

<template>
  <Story title="TxCombobox" group="seleccion">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-col">
        <TxCombobox
          v-model="state.value"
          :options="titles"
          :label="state.label"
          :placeholder="state.placeholder"
          :clearable="state.clearable"
          :error="state.error || undefined"
          nothing-found="Ningún título coincide."
          :width="360"
        />
        <p class="story-note">
          Value: <code>{{ JSON.stringify(state.value) }}</code>. Try "magico 2" (no accent, in
          another order) or "tpe".
        </p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.placeholder" title="placeholder" />
        <HstText v-model="state.error" title="error" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
      </template>
    </Variant>

    <Variant title="Picker mode (adding lines)">
      <div class="story-col">
        <TxCombobox
          label="Agregar título por código o nombre"
          placeholder="Escriba y elija…"
          :options="titles"
          picker
          :list-width="420"
          @select="(v) => added.push(v)"
        />
        <p class="story-note">Added: {{ added.join(", ") || "none" }}</p>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCombobox

One option from a **long list**, found by typing — the ~300-SKU catalog, the accounts.
It matches **every word, in any order and ignoring accents**: "magico 2" finds "Lenguaje Mágico 2".

```vue
<TxCombobox v-model="code" label="SKU" :options="skuOptions" clearable />

<!-- Picker mode: each choice is emitted and the field is cleared for the next one -->
<TxCombobox
  label="Agregar título por código o nombre"
  :options="skuOptions"
  picker
  @select="addLine"
/>
```

| Prop | Type | Default | |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | |
| `options` | `{ value; label; disabled?; keywords? }[]` | — | `keywords` are searched too |
| `filter` | `(option, query) => boolean` | every word | For a custom criterion |
| `limit` | `number` | `50` | Options rendered; typing narrows the rest |
| `picker` | `boolean` | `false` | Emits `select` and clears itself |
| `clearable` | `boolean` | `false` | |
| `listWidth` | `number \| string` | the field's width | The list can be wider than the field |
| `nothingFound` | `string` | `"Sin resultados"` | |
| `label`, `description`, `error`, `placeholder`, `disabled`, `size`, `width`, `id` | | | |

**Slot:** `option` (`{ option }`) to render each option. **Events:** `update:modelValue`,
`select`. **Exposes:** `focus()`.

## Behavior

- If a search is abandoned halfway, the field shows the chosen option again.
- Works with mouse and keyboard (arrows, Enter, Escape).
- The `<input>` is the `combobox`, named by the label or by `aria-label`.
</docs>
