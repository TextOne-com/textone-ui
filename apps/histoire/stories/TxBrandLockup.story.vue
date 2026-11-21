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
        <HstText v-model="state.product" title="Slot (product name)" />
      </template>
    </Variant>
    <Variant title="On cream and purple">
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

The official lockup (brand manual, slides 7–8): the T icon, **TEXT ONE** in Plus Jakarta Sans
ExtraBold, a thin rule and **.com** — the same one the website header draws. The icon is the logo
SVG with `currentColor`, so it works on white, cream or purple without boxes.

```vue
<TxBrandLockup :size="18" />

<!-- In an app's bar: a link to home and the product name -->
<TxBrandLockup :as="RouterLink" to="/" :size="15">
  <span class="product">Inventario y cartera</span>
</TxBrandLockup>
```

| Prop | Type | Default | |
|---|---|---|---|
| `size` | `number` | `18` | Size of the word in px; the icon scales with it |
| `iconOnly` | `boolean` | `false` | Icon only (avatars, square spaces) |
| `as` | `string \| Component` | `"span"` | `"a"`, `RouterLink`… |
| `label` | `string` | `"Text One.com"` | Accessible name; the drawing is hidden from screen readers |

**Default slot:** whatever goes after the lockup.

## Brand manual rules

- Minimum: the lockup never goes below **120 px wide**; the icon alone, below **24 px**.
- Clear space around it = the height of the T.
- Do not distort, rotate, recolor outside the palette, or use on low-contrast backgrounds.
</docs>
