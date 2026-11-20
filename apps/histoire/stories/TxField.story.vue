<script setup lang="ts">
import { TxField } from "@textone-com/vue";
import { useId } from "vue";

const id = useId();
</script>

<template>
  <Story title="TxField" group="campos">
    <Variant title="Un control propio en el marco">
      <div class="story-col">
        <TxField :id="id" label="Color de la portada" description="Elija uno de la paleta institucional." error="Requerido">
          <input :id="id" type="color" value="#431581" :aria-describedby="`${id}-description ${id}-error`" />
        </TxField>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxField

El marco que usan todos los campos: **etiqueta → descripción → control → error**. Úsalo solo para
envolver un control que no está en el sistema; los campos del sistema ya lo traen.

```vue
<TxField :id="id" label="Color" description="…" :error="err">
  <input :id="id" :aria-describedby="`${id}-description ${id}-error`" />
</TxField>
```

| Prop | Tipo | |
|---|---|---|
| `id` | `string` (requerido) | El `id` de tu control; la etiqueta lo apunta |
| `label`, `description`, `error`, `required` | | |
| `descriptionPosition` | `above \| below` | |
| `as` | `div \| fieldset` | `fieldset` para un grupo de radios |

La descripción y el error se renderizan con `id="<id>-description"` y `id="<id>-error"`: enlázalos
con `aria-describedby` en tu control.
</docs>
