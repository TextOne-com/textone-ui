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
    <Variant title="Views of an account">
      <div class="story-col" style="max-width: 720px">
        <TxTabs v-model="view" :tabs="tabs" label="Vistas de la cuenta">
          <template #default="{ active }">
            <p style="margin: 0">Content of <strong>{{ active }}</strong>.</p>
          </template>
        </TxTabs>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxTabs

Several **views of the same thing**, one at a time (summary, movements, matrix…). The slot is the
active tab's panel: draw whatever `modelValue` names.

```vue
<TxTabs v-model="vista" :tabs="tabs" label="Vistas de la cuenta">
  <template #default="{ active }">
    <SummaryTab v-if="active === 'resumen'" />
    <MatrixTab v-else-if="active === 'matriz'" />
  </template>
</TxTabs>
```

| Prop | Type | |
|---|---|---|
| `modelValue` | `string` (required) | The active tab |
| `tabs` | `{ value; label; disabled? }[]` | |
| `label` | `string` | The list's accessible name |

Keep the tab in the URL (`?vista=matriz`) so it survives a reload and can be shared. Real tabs:
`role="tab"`, `aria-selected`, arrow keys to move.
</docs>
