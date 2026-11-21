<script setup lang="ts">
import { IconDownload, IconPlus } from "@tabler/icons-vue";
import { TxButton } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({
  label: "Registrar remisión",
  variant: "filled" as "filled" | "default" | "subtle" | "light" | "danger",
  size: "sm" as "xs" | "sm" | "md",
  disabled: false,
  loading: false,
  fullWidth: false,
});
</script>

<template>
  <Story title="TxButton" group="acciones">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-pad" :style="{ width: state.fullWidth ? '360px' : undefined }">
        <TxButton
          :variant="state.variant"
          :size="state.size"
          :disabled="state.disabled"
          :loading="state.loading"
          :full-width="state.fullWidth"
        >
          {{ state.label }}
        </TxButton>
      </div>
      <template #controls>
        <HstText v-model="state.label" title="Text" />
        <HstSelect v-model="state.variant" title="variant" :options="['filled', 'default', 'subtle', 'light', 'danger']" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
        <HstCheckbox v-model="state.loading" title="loading" />
        <HstCheckbox v-model="state.fullWidth" title="fullWidth" />
      </template>
    </Variant>

    <Variant title="Variants">
      <div class="story-pad">
        <TxButton>Registrar remisión</TxButton>
        <TxButton variant="default">Ver la cuenta</TxButton>
        <TxButton variant="light">Registrar otro</TxButton>
        <TxButton variant="subtle">Quitar filtro</TxButton>
        <TxButton variant="danger">Rechazar</TxButton>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="story-pad" style="align-items: center">
        <TxButton size="xs">xs · 26px</TxButton>
        <TxButton size="sm">sm · 32px</TxButton>
        <TxButton size="md">md · 40px</TxButton>
      </div>
    </Variant>

    <Variant title="States">
      <div class="story-pad">
        <TxButton disabled>Deshabilitado</TxButton>
        <TxButton loading>Registrando</TxButton>
        <TxButton as="a" href="#" disabled>Enlace deshabilitado</TxButton>
      </div>
    </Variant>

    <Variant title="With icon">
      <div class="story-pad">
        <TxButton variant="default">
          <template #left><IconDownload :size="16" stroke="2" aria-hidden="true" /></template>
          Descargar XLSX
        </TxButton>
        <TxButton variant="subtle">
          <template #left><IconPlus :size="16" stroke="2" aria-hidden="true" /></template>
          Agregar línea
        </TxButton>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxButton

A button — or, with `as`, a **link shaped like a button** (`RouterLink`, `a`). A pill, like the
public website's buttons.

```vue
<TxButton @click="save">Registrar remisión</TxButton>
<TxButton variant="default" :as="RouterLink" :to="`/cuentas/${id}`">Ver la cuenta</TxButton>
<TxButton type="submit" :loading="mutation.isPending">Registrar</TxButton>
```

| Prop | Type | Default | |
|---|---|---|---|
| `variant` | `filled \| default \| subtle \| light \| danger` | `filled` | See below |
| `size` | `xs \| sm \| md` | `sm` | 26 / 32 / 40 px |
| `as` | `string \| Component` | `"button"` | To navigate: `RouterLink`, `"a"` |
| `type` | `button \| submit \| reset` | `button` | Only when `as` is `button` |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy`, and cannot be pressed |
| `fullWidth` | `boolean` | `false` | |

**Slots:** default (text), `left` and `right` (icons).

## Which variant

- **filled** — the screen's main action. One per screen.
- **default** — secondary actions (soft purple outline, as on the website).
- **light** — a secondary action with more presence ("Registrar otro").
- **subtle** — tertiary actions inside tables or lists.
- **danger** — irreversible or rejecting actions.

## Accessibility

- A disabled link renders **without `href`** and with `aria-disabled`: it cannot be followed.
- An icon-only button is `TxIconButton`, which requires `label`.
- Focus is always visible (2 px purple ring).
</docs>
