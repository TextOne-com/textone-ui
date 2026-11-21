<script setup lang="ts">
import { IconChecklist, IconLayoutDashboard, IconLayoutGrid, IconPlus, IconUsers } from "@tabler/icons-vue";
import { TxBottomNav, TxBottomNavItem } from "@textone-com/vue";
import { ref } from "vue";

const active = ref("panel");
</script>

<template>
  <Story title="TxBottomNav" group="estructura" :layout="{ type: 'single', iframe: true }">
    <Variant title="Phone">
      <div style="max-width: 390px; margin: 24px auto; border: 1px solid var(--rule-strong); border-radius: 24px; overflow: hidden; height: 220px; display: flex; flex-direction: column; justify-content: flex-end; background: var(--canvas)">
        <TxBottomNav>
          <TxBottomNavItem as="button" label="Panel" :active="active === 'panel'" @click="active = 'panel'">
            <template #icon><IconLayoutDashboard stroke="2" /></template>
          </TxBottomNavItem>
          <TxBottomNavItem as="button" label="Cuentas" :active="active === 'cuentas'" @click="active = 'cuentas'">
            <template #icon><IconUsers stroke="2" /></template>
          </TxBottomNavItem>
          <TxBottomNavItem as="button" label="Remisión" primary :active="active === 'remision'" @click="active = 'remision'">
            <template #icon><IconPlus stroke="2" /></template>
          </TxBottomNavItem>
          <TxBottomNavItem as="button" label="Aprobar" :badge="2" badge-label="2 pendientes" :active="active === 'aprobar'" @click="active = 'aprobar'">
            <template #icon><IconChecklist stroke="2" /></template>
          </TxBottomNavItem>
          <TxBottomNavItem as="button" label="Más">
            <template #icon><IconLayoutGrid stroke="2" /></template>
          </TxBottomNavItem>
        </TxBottomNav>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxBottomNav

**Phone** navigation: four or five destinations at the bottom, within thumb reach, above the
home bar. `primary` raises the daily action to a purple circle. The remaining destinations go in
a TxSheet opened from "Más" (More).

Inside **TxAppShell**, in the `bottombar` slot: it appears below 768 px and the side menu is
hidden; the page leaves room for the bar.

```vue
<TxAppShell>
  <template #bottombar>
    <TxBottomNav>
      <TxBottomNavItem :as="RouterLink" to="/" label="Panel" :active="…">
        <template #icon><IconLayoutDashboard stroke="2" /></template>
      </TxBottomNavItem>
    </TxBottomNav>
  </template>
</TxAppShell>
```

**TxBottomNavItem:** `label` (short: ~10 letters), `active`, `as`, `primary`, `badge`, `badgeLabel`.
</docs>
