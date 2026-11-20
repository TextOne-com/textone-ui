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
          Valor: <code>{{ JSON.stringify(state.value) }}</code>. Prueba "magico 2" (sin tilde, en
          otro orden) o "tpe".
        </p>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="label" />
        <HstText v-model="state.placeholder" title="placeholder" />
        <HstText v-model="state.error" title="error" />
        <HstCheckbox v-model="state.clearable" title="clearable" />
      </template>
    </Variant>

    <Variant title="Modo picker (agregar líneas)">
      <div class="story-col">
        <TxCombobox
          label="Agregar título por código o nombre"
          placeholder="Escriba y elija…"
          :options="titles"
          picker
          :list-width="420"
          @select="(v) => added.push(v)"
        />
        <p class="story-note">Agregados: {{ added.join(", ") || "ninguno" }}</p>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCombobox

Una opción de una **lista larga**, encontrada escribiendo — el catálogo de ~300 SKU, las cuentas.
Busca **cada palabra, en cualquier orden y sin tildes**: "magico 2" encuentra "Lenguaje Mágico 2".

```vue
<TxCombobox v-model="code" label="SKU" :options="skuOptions" clearable />

<!-- Modo picker: cada elección se emite y el campo queda vacío para la siguiente -->
<TxCombobox
  label="Agregar título por código o nombre"
  :options="skuOptions"
  picker
  @select="addLine"
/>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | |
| `options` | `{ value; label; disabled?; keywords? }[]` | — | `keywords` también se buscan |
| `filter` | `(option, query) => boolean` | todas las palabras | Para un criterio propio |
| `limit` | `number` | `50` | Opciones dibujadas; escribir acota el resto |
| `picker` | `boolean` | `false` | Emite `select` y se vacía |
| `clearable` | `boolean` | `false` | |
| `listWidth` | `number \| string` | ancho del campo | La lista puede ser más ancha que el campo |
| `nothingFound` | `string` | `"Sin resultados"` | |
| `label`, `description`, `error`, `placeholder`, `disabled`, `size`, `width`, `id` | | | |

**Slot:** `option` (`{ option }`) para dibujar cada opción. **Eventos:** `update:modelValue`,
`select`. **Expone:** `focus()`.

## Comportamiento

- Si se abandona una búsqueda a medias, el campo vuelve a mostrar la opción elegida.
- Funciona con mouse y con teclado (flechas, Enter, Escape).
- El `<input>` es el `combobox`, con el nombre de la etiqueta o de `aria-label`.
</docs>
