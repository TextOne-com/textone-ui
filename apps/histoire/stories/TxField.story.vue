<script setup lang="ts">
import { TxField } from "@textone-com/vue";
import { useId } from "vue";

const id = useId();
</script>

<template>
  <Story title="TxField" group="campos">
    <Variant title="A custom control in the frame">
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

The frame every field uses: **label → description → control → error**. Use it only to wrap a
control that is not in the system; the system's fields already include it.

```vue
<TxField :id="id" label="Color" description="…" :error="err">
  <input :id="id" :aria-describedby="`${id}-description ${id}-error`" />
</TxField>
```

| Prop | Type | |
|---|---|---|
| `id` | `string` (required) | Your control's `id`; the label points to it |
| `label`, `description`, `error`, `required` | | |
| `descriptionPosition` | `above \| below` | |
| `as` | `div \| fieldset` | `fieldset` for a radio group |

The description and the error render with `id="<id>-description"` and `id="<id>-error"`: link
them with `aria-describedby` on your control.
</docs>
