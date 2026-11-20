<script setup lang="ts">
import { TxButton, TxDialog, TxTextarea } from "@textone-com/vue";
import { ref } from "vue";

const open = ref(false);
const note = ref("");
</script>

<template>
  <Story title="TxDialog" group="estructura">
    <Variant title="Aprobar una solicitud">
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

Una **decisión modal**: título, cuerpo y las acciones en `footer`. Escape y × lo cierran; el foco
queda atrapado dentro mientras está abierto y vuelve al botón que lo abrió al cerrarse.

```vue
<TxDialog v-model:open="open" title="Aprobar la solicitud" initial-focus="#nota">
  <TxTextarea id="nota" v-model="note" label="Nota" />
  <template #footer>
    <TxButton variant="default" @click="open = false">Cancelar</TxButton>
    <TxButton @click="approve">Aprobar y registrar</TxButton>
  </template>
</TxDialog>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `open` | `boolean` (`v-model:open`) | `false` | |
| `title` | `string` (requerido) | — | En Fraunces, morado |
| `description` | `string` | — | Bajo el título; se anuncia con el diálogo |
| `width` | `number` | `460` | px, nunca más ancho que la pantalla |
| `initialFocus` | `string` | — | Selector CSS a enfocar al abrir (si no, el ×) |
| `closeLabel` | `string` | `"Cerrar"` | |

Úsalo para decidir, no para mostrar información que podría estar en la página.
</docs>
