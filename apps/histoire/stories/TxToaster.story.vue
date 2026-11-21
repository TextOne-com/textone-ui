<script setup lang="ts">
import { toast, TxButton, TxToaster } from "@textone-com/vue";
</script>

<template>
  <Story title="TxToaster" group="estados" :layout="{ type: 'single', iframe: true }">
    <Variant title="Notices">
      <div class="story-pad" style="display: flex; gap: 8px; flex-wrap: wrap; min-height: 320px; align-content: flex-start">
        <TxButton @click="toast({ title: 'Recibo de caja registrado: $ 125.000,50 el 21/11/2025.', action: { label: 'Ver la cuenta' } })">
          Success with action
        </TxButton>
        <TxButton variant="default" @click="toast({ title: 'Solicitud rechazada.', tone: 'info' })">Info</TxButton>
        <TxButton variant="danger" @click="toast({ title: 'No se pudo registrar', description: 'Sin conexión con el servidor.', tone: 'error' })">
          Error (stays until closed)
        </TxButton>
        <TxToaster />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxToaster and `toast()`

Tell the person something happened **without moving them**: "Recibo registrado" (receipt
recorded), with an action to go and see it. Mount **one** `<TxToaster />` near the app's root and
call `toast()` from anywhere.

```ts
import { toast } from "@textone-com/vue";

toast({
  title: "Recibo de caja registrado: $ 125.000,50.",
  action: { label: "Ver la cuenta", onClick: () => router.push(`/cuentas/${id}`) },
});
```

- **Duration**: 5 s; errors (`tone: "error"`) stay until closed. A line at the bottom drains over
  time; **hovering or focusing it pauses it**.
- At most four at a time; the oldest goes.
- Successes and info are announced politely (`status`); errors, immediately (`alert`).
- Desktop: bottom right. Phone: full width, **above the bottom bar**.

| Option | Type | |
|---|---|---|
| `title` | `string` | required |
| `description` | `string` | |
| `tone` | `success \| info \| error` | `success` |
| `action` | `{ label, onClick?, href? }` | |
| `duration` | `number` (ms) | `5000`; `0` never leaves on its own |

`dismissToast(id)` removes one; `toasts` is the list (read-only).
</docs>
