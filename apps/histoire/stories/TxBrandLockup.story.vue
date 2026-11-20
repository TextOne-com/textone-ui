<script setup lang="ts">
import { TxBrandLockup } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({ size: 18, iconOnly: false, product: "Inventario y cartera" });
</script>

<template>
  <Story title="TxBrandLockup" group="fundamentos">
    <Variant title="Playground" :init-state="() => state">
      <div class="story-pad">
        <TxBrandLockup :size="state.size" :icon-only="state.iconOnly">
          <span
            v-if="state.product"
            style="border-left: 1px solid var(--rule-strong); padding-left: 12px; font-size: 13px; font-weight: 600; color: var(--ink-secondary)"
            >{{ state.product }}</span
          >
        </TxBrandLockup>
      </div>
      <template #controls>
        <HstSlider v-model="state.size" title="size (px)" :min="11" :max="40" />
        <HstCheckbox v-model="state.iconOnly" title="iconOnly" />
        <HstText v-model="state.product" title="Slot (nombre del producto)" />
      </template>
    </Variant>
    <Variant title="Sobre crema y morado">
      <div class="story-pad">
        <div style="background: var(--cream-100); padding: 20px 24px; border-radius: var(--radius-sm)">
          <TxBrandLockup :size="18" />
        </div>
        <div class="on-purple" style="background: var(--brand-700); padding: 20px 24px; border-radius: var(--radius-sm); color: #fff">
          <TxBrandLockup :size="18" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.on-purple :deep(.tx-lockup__name) {
  color: #fff;
}
.on-purple :deep(.tx-lockup__dotcom) {
  color: var(--brand-100);
  border-color: var(--brand-100);
}
</style>

<docs lang="md">
# TxBrandLockup

El lockup oficial (manual, diapositivas 7–8): el ícono T, **TEXTONE** en Plus Jakarta Sans
ExtraBold, una regla fina y **.com** — el mismo que dibuja el encabezado del sitio. El ícono es el
SVG del logo con `currentColor`, así funciona sobre blanco, crema o morado sin recuadros.

```vue
<TxBrandLockup :size="18" />

<!-- En la barra de una app: enlace al inicio y el nombre del producto -->
<TxBrandLockup :as="RouterLink" to="/" :size="15">
  <span class="product">Inventario y cartera</span>
</TxBrandLockup>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `size` | `number` | `18` | Tamaño de la palabra en px; el ícono escala con ella |
| `iconOnly` | `boolean` | `false` | Solo el ícono (avatares, espacios cuadrados) |
| `as` | `string \| Component` | `"span"` | `"a"`, `RouterLink`… |
| `label` | `string` | `"Textone.com"` | Nombre accesible; el dibujo se oculta a lectores |

**Slot por defecto:** lo que va después del lockup.

## Reglas del manual

- Mínimo: el lockup no baja de **120 px de ancho**; el ícono solo, de **24 px**.
- Área de respiro alrededor = la altura de la T.
- No deformar, no rotar, no recolorear fuera de la paleta, no usar sobre fondos de bajo contraste.
</docs>
