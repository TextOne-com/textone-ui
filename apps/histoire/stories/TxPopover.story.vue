<script setup lang="ts">
import { TxAvatar, TxButton, TxPopover, TxSelect } from "@textone-com/vue";
import { ref } from "vue";

const user = ref<string | null>("4");
const users = [
  { value: "3", label: "Auxiliar local", description: "Cartera" },
  { value: "4", label: "Aprobador local", description: "Aprobaciones" },
];
</script>

<template>
  <Story title="TxPopover" group="estructura">
    <Variant title="Menú de cuenta">
      <div class="story-pad" style="height: 320px; display: flex; justify-content: flex-end">
        <TxPopover align="end" label="Su cuenta" :width="280">
          <template #trigger>
            <TxButton variant="subtle">Abrir menú de cuenta</TxButton>
          </template>
          <template #default="{ close }">
            <div style="display: flex; flex-direction: column; gap: 12px">
              <div style="display: flex; gap: 10px; align-items: center">
                <TxAvatar name="Aprobador local" :size="40" />
                <strong>Aprobador local</strong>
              </div>
              <TxSelect v-model="user" label="Actuando como" :options="users" />
              <TxButton size="xs" @click="close">Listo</TxButton>
            </div>
          </template>
        </TxPopover>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxPopover

Un panel pequeño **anclado a su botón**: el selector de contexto, el menú de cuenta. Escape o un
clic afuera lo cierran y el foco vuelve al botón. Puede contener selects y calendarios: sus
listas se abren por encima.

```vue
<TxPopover v-model:open="abierto" align="end" label="Su cuenta">
  <template #trigger><button>…</button></template>
  <template #default="{ close }">…</template>
</TxPopover>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `side` / `align` | | `bottom` / `start` | |
| `width` | `number` | `300` | px, nunca más ancho que la pantalla |
| `label` | `string` | — | Nombre del panel para lectores de pantalla (si no, el del botón) |

**Slots:** `trigger` (el botón, con nombre propio) y el panel, que recibe `close()`.
</docs>
