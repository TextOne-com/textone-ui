<script setup lang="ts">
import { TxTabs } from "@textone-com/vue";
import { ref } from "vue";

const view = ref("resumen");
const tabs = [
  { value: "resumen", label: "Resumen" },
  { value: "movimientos", label: "Movimientos" },
  { value: "documentos", label: "Documentos" },
  { value: "matriz", label: "Matriz" },
  { value: "precios", label: "Precios" },
];
</script>

<template>
  <Story title="TxTabs" group="estructura">
    <Variant title="Vistas de una cuenta">
      <div class="story-col" style="max-width: 720px">
        <TxTabs v-model="view" :tabs="tabs" label="Vistas de la cuenta">
          <template #default="{ active }">
            <p style="margin: 0">Contenido de <strong>{{ active }}</strong>.</p>
          </template>
        </TxTabs>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxTabs

Varias **vistas de una misma cosa**, una a la vez (resumen, movimientos, matriz…). El slot es el
panel de la pestaña activa: dibuja lo que nombra `modelValue`.

```vue
<TxTabs v-model="vista" :tabs="tabs" label="Vistas de la cuenta">
  <template #default="{ active }">
    <SummaryTab v-if="active === 'resumen'" />
    <MatrixTab v-else-if="active === 'matriz'" />
  </template>
</TxTabs>
```

| Prop | Tipo | |
|---|---|---|
| `modelValue` | `string` (requerido) | La pestaña activa |
| `tabs` | `{ value; label; disabled? }[]` | |
| `label` | `string` | Nombre accesible de la lista |

Guarda la pestaña en la URL (`?vista=matriz`) para que sobreviva a una recarga y se pueda
compartir. Pestañas reales: `role="tab"`, `aria-selected`, flechas para moverse.
</docs>
