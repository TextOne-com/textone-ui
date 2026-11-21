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
    <Variant title="Account menu">
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

A small panel **anchored to its button**: the context picker, the account menu. Escape or a click
outside closes it and focus returns to the button. It can hold selects and calendars: their lists
open above it.

```vue
<TxPopover v-model:open="abierto" align="end" label="Su cuenta">
  <template #trigger><button>…</button></template>
  <template #default="{ close }">…</template>
</TxPopover>
```

| Prop | Type | Default | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `side` / `align` | | `bottom` / `start` | |
| `width` | `number` | `300` | px, never wider than the screen |
| `label` | `string` | — | The panel's name for screen readers (otherwise the button's) |

**Slots:** `trigger` (the button, with its own name) and the panel, which receives `close()`.
</docs>
