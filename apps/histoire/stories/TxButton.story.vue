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
        <HstText v-model="state.label" title="Texto" />
        <HstSelect v-model="state.variant" title="variant" :options="['filled', 'default', 'subtle', 'light', 'danger']" />
        <HstButtonGroup v-model="state.size" title="size" :options="['xs', 'sm', 'md']" />
        <HstCheckbox v-model="state.disabled" title="disabled" />
        <HstCheckbox v-model="state.loading" title="loading" />
        <HstCheckbox v-model="state.fullWidth" title="fullWidth" />
      </template>
    </Variant>

    <Variant title="Variantes">
      <div class="story-pad">
        <TxButton>Registrar remisión</TxButton>
        <TxButton variant="default">Ver la cuenta</TxButton>
        <TxButton variant="light">Registrar otro</TxButton>
        <TxButton variant="subtle">Quitar filtro</TxButton>
        <TxButton variant="danger">Rechazar</TxButton>
      </div>
    </Variant>

    <Variant title="Tamaños">
      <div class="story-pad" style="align-items: center">
        <TxButton size="xs">xs · 26px</TxButton>
        <TxButton size="sm">sm · 32px</TxButton>
        <TxButton size="md">md · 40px</TxButton>
      </div>
    </Variant>

    <Variant title="Estados">
      <div class="story-pad">
        <TxButton disabled>Deshabilitado</TxButton>
        <TxButton loading>Registrando</TxButton>
        <TxButton as="a" href="#" disabled>Enlace deshabilitado</TxButton>
      </div>
    </Variant>

    <Variant title="Con ícono">
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

Un botón — o, con `as`, un **enlace con forma de botón** (`RouterLink`, `a`). Píldora, como los
botones del sitio público.

```vue
<TxButton @click="save">Registrar remisión</TxButton>
<TxButton variant="default" :as="RouterLink" :to="`/cuentas/${id}`">Ver la cuenta</TxButton>
<TxButton type="submit" :loading="mutation.isPending">Registrar</TxButton>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `variant` | `filled \| default \| subtle \| light \| danger` | `filled` | Ver abajo |
| `size` | `xs \| sm \| md` | `sm` | 26 / 32 / 40 px |
| `as` | `string \| Component` | `"button"` | Para navegar: `RouterLink`, `"a"` |
| `type` | `button \| submit \| reset` | `button` | Solo cuando `as` es `button` |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Muestra un spinner, `aria-busy`, y no se puede pulsar |
| `fullWidth` | `boolean` | `false` | |

**Slots:** por defecto (texto), `left` y `right` (íconos).

## Qué variante

- **filled** — la acción principal de la pantalla. Una por pantalla.
- **default** — acciones secundarias (contorno morado suave, como en el sitio).
- **light** — una secundaria con más presencia ("Registrar otro").
- **subtle** — acciones terciarias dentro de tablas o listas.
- **danger** — irreversibles o de rechazo.

## Accesibilidad

- Como enlace deshabilitado se renderiza **sin `href`** y con `aria-disabled`: no se puede seguir.
- Un botón solo con ícono es `TxIconButton`, que exige `label`.
- El foco se ve siempre (anillo morado de 2 px).
</docs>
