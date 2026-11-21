<script setup lang="ts">
import { TxAppShell, TxBrandLockup, TxPageHeader } from "@textone-com/vue";
</script>

<template>
  <Story title="TxAppShell" group="estructura" :layout="{ type: 'single', iframe: true }">
    <Variant title="The frame of an internal tool">
      <div style="height: 520px">
        <TxAppShell :header-height="60" :navbar-width="220" style="height: 100%">
          <template #header>
            <div style="height: 100%; display: flex; align-items: center; padding: 0 16px">
              <TxBrandLockup :size="15">
                <span style="border-left: 1px solid var(--rule-strong); padding-left: 12px; font-size: 13px; font-weight: 600; color: var(--ink-secondary)">Inventario y cartera</span>
              </TxBrandLockup>
            </div>
          </template>
          <template #navbar>
            <nav aria-label="Principal" style="padding: 16px 12px; display: flex; flex-direction: column; gap: 2px">
              <span class="tx-eyebrow" style="color: var(--ink-secondary); padding: 0 12px 4px">Saldos</span>
              <a href="#" class="nav nav--active">Panel de control</a>
              <a href="#" class="nav">Cuentas</a>
              <a href="#" class="nav">Nueva remisión</a>
            </nav>
          </template>
          <div style="padding: 20px 24px">
            <TxPageHeader title="Panel de control" context="2025 Calendario A" />
          </div>
        </TxAppShell>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.nav {
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  color: var(--ink);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.nav:hover {
  background: var(--hover);
  color: var(--accent);
}
.nav--active {
  background: var(--accent-tint);
  color: var(--accent);
}
</style>

<docs lang="md">
# TxAppShell

The frame of an internal tool: a **top bar** (lockup, context, user), a **navigation column** on
the left and the **page**. The navigation shares the cream background; a thin rule separates it.

```vue
<TxAppShell :header-height="60">
  <template #header>…lockup and controls…</template>
  <template #navbar><nav aria-label="Principal">…</nav></template>
  <RouterView />
</TxAppShell>
```

| Prop | Default |
|---|---|
| `navbarWidth` | `232` |
| `headerHeight` | `52` |

The navigation follows the website: bold **pills**, the active one in purple on `--accent-tint`;
group labels as `.tx-eyebrow` in `--ink-secondary` (on cream, `brand-300` does not reach AA).
</docs>
