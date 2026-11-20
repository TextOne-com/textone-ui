<script setup lang="ts">
import { TxAppShell, TxBrandLockup, TxPageHeader } from "@textone-com/vue";
</script>

<template>
  <Story title="TxAppShell" group="estructura" :layout="{ type: 'single', iframe: true }">
    <Variant title="El marco de una herramienta interna">
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

El marco de una herramienta interna: **barra superior** (lockup, contexto, usuario), **columna de
navegación** a la izquierda y la **página**. La navegación comparte el fondo crema; una línea fina
la separa.

```vue
<TxAppShell :header-height="60">
  <template #header>…lockup y controles…</template>
  <template #navbar><nav aria-label="Principal">…</nav></template>
  <RouterView />
</TxAppShell>
```

| Prop | Por defecto |
|---|---|
| `navbarWidth` | `232` |
| `headerHeight` | `52` |

La navegación sigue al sitio: **píldoras** en negrita, la activa sobre `--accent-tint` en morado;
etiquetas de grupo como `.tx-eyebrow` en `--ink-secondary` (sobre crema, `brand-300` no llega a AA).
</docs>
