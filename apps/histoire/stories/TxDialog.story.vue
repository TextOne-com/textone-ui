<script setup lang="ts">
import { TxButton, TxDialog, TxTextarea } from "@textone-com/vue";
import { ref } from "vue";

const open = ref(false);
const note = ref("");
</script>

<template>
  <Story title="TxDialog" group="estructura">
    <Variant title="Approving a request">
      <div class="story-pad">
        <TxButton @click="open = true">Aprobar…</TxButton>
        <TxDialog
          v-model:open="open"
          title="Aprobar la solicitud"
          description="Al aprobarla se registra el movimiento y cambia el saldo de la cuenta."
          initial-focus="#nota-aprobacion"
        >
          <TxTextarea id="nota-aprobacion" v-model="note" label="Nota" description="Opcional." :rows="2" autosize />
          <template #footer>
            <TxButton variant="default" @click="open = false">Cancelar</TxButton>
            <TxButton @click="open = false">Aprobar y registrar</TxButton>
          </template>
        </TxDialog>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDialog

A **modal decision**: title, body and the actions in `footer`. Escape and × close it; focus is
trapped inside while it is open and returns to the button that opened it when it closes.

```vue
<TxDialog v-model:open="open" title="Aprobar la solicitud" initial-focus="#nota">
  <TxTextarea id="nota" v-model="note" label="Nota" />
  <template #footer>
    <TxButton variant="default" @click="open = false">Cancelar</TxButton>
    <TxButton @click="approve">Aprobar y registrar</TxButton>
  </template>
</TxDialog>
```

| Prop | Type | Default | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `title` | `string` (required) | — | In Fraunces, purple |
| `description` | `string` | — | Below the title; announced with the dialog |
| `width` | `number` | `460` | px, never wider than the screen |
| `initialFocus` | `string` | — | CSS selector to focus on open (otherwise the ×) |
| `closeLabel` | `string` | `"Cerrar"` | |

Use it to decide, not to show information that could live on the page.
</docs>
