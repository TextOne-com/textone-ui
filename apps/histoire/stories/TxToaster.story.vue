<script setup lang="ts">
import { toast, TxButton, TxToaster } from "@textone-com/vue";
</script>

<template>
  <Story title="TxToaster" group="estados" :layout="{ type: 'single', iframe: true }">
    <Variant title="Avisos">
      <div class="story-pad" style="display: flex; gap: 8px; flex-wrap: wrap; min-height: 320px; align-content: flex-start">
        <TxButton @click="toast({ title: 'Recibo de caja registrado: $ 125.000,50 el 21/11/2025.', action: { label: 'Ver la cuenta' } })">
          Éxito con acción
        </TxButton>
        <TxButton variant="default" @click="toast({ title: 'Solicitud rechazada.', tone: 'info' })">Información</TxButton>
        <TxButton variant="danger" @click="toast({ title: 'No se pudo registrar', description: 'Sin conexión con el servidor.', tone: 'error' })">
          Error (queda hasta cerrarlo)
        </TxButton>
        <TxToaster />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxToaster y `toast()`

Avisar que algo pasó **sin mover a la persona**: "Recibo registrado", con una acción para ir a
verlo. Se monta **un** `<TxToaster />` cerca de la raíz de la app y se llama `toast()` desde
cualquier lado.

```ts
import { toast } from "@textone-com/vue";

toast({
  title: "Recibo de caja registrado: $ 125.000,50.",
  action: { label: "Ver la cuenta", onClick: () => router.push(`/cuentas/${id}`) },
});
```

- **Duración**: 5 s; los errores (`tone: "error"`) quedan hasta cerrarlos. Una línea al pie se
  vacía con el tiempo; **pasar el mouse o enfocarlo lo detiene**.
- Como máximo cuatro a la vez; el más viejo se va.
- Éxitos e información se anuncian con cortesía (`status`); los errores, de inmediato (`alert`).
- Escritorio: abajo a la derecha. Teléfono: a lo ancho, **encima de la barra inferior**.

| Opción | Tipo | |
|---|---|---|
| `title` | `string` | requerido |
| `description` | `string` | |
| `tone` | `success \| info \| error` | `success` |
| `action` | `{ label, onClick?, href? }` | |
| `duration` | `number` (ms) | `5000`; `0` no se va solo |

`dismissToast(id)` lo quita; `toasts` es la lista (solo lectura).
</docs>
