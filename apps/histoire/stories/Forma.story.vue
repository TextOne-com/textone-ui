<script setup lang="ts">
const spaces = [1, 2, 3, 4, 5, 6, 8];
const radii = [
  { name: "radius-xs", use: "Detalles mínimos" },
  { name: "radius-sm", use: "Tarjetas, paneles, tablas" },
  { name: "radius-control", use: "Campos, menús" },
  { name: "radius-lg", use: "Diálogos" },
  { name: "radius-pill", use: "Botones, chips, navegación" },
];
</script>

<template>
  <Story title="Spacing & shape" group="fundamentos" :layout="{ type: 'single', iframe: false }">
    <div class="story-col" style="max-width: 760px">
      <h2 class="tx-title tx-title--3">Espaciado — rejilla de 4 px</h2>
      <div style="display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap">
        <div v-for="n in spaces" :key="n" style="display: flex; flex-direction: column; align-items: center; gap: 4px">
          <div :style="{ width: `var(--space-${n})`, height: `var(--space-${n})`, background: 'var(--brand-100)' }" />
          <code style="font-size: 11px; color: var(--ink-secondary)">--space-{{ n }}</code>
        </div>
      </div>

      <h2 class="tx-title tx-title--3">Radios</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <div v-for="r in radii" :key="r.name" style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start">
          <div :style="{ width: '96px', height: '48px', background: 'var(--surface)', border: '1px solid var(--rule-strong)', borderRadius: `var(--${r.name})` }" />
          <code style="font-size: 11px">--{{ r.name }}</code>
          <small style="font-size: 11px; color: var(--ink-secondary)">{{ r.use }}</small>
        </div>
      </div>

      <h2 class="tx-title tx-title--3">Profundidad</h2>
      <div style="display: flex; gap: 24px">
        <div style="width: 160px; height: 72px; background: var(--surface); border: 1px solid var(--rule-strong); border-radius: var(--radius-sm); display: grid; place-items: center; font-size: 12px">Borde (todo)</div>
        <div style="width: 160px; height: 72px; background: var(--surface); box-shadow: var(--shadow-overlay); border-radius: var(--radius-control); display: grid; place-items: center; font-size: 12px">--shadow-overlay (lo que flota)</div>
      </div>
    </div>
  </Story>
</template>

<docs lang="md">
# Espaciado y forma

- **Rejilla de 4 px:** `--space-1` (4) … `--space-8` (32).
- **Forma del sitio público:** tarjetas y tablas casi cuadradas (4 px), campos redondeados (8 px),
  diálogos de 12 px, y **botones, chips y navegación en píldora**.
- **Bordes antes que sombras.** La única sombra, `--shadow-overlay` (teñida de morado), es para
  lo que flota: menús, calendario, diálogos.
- **Densidad:** filas de 28 px (`--row-h-compact`) en tablas de cifras y 36 px en listas; controles
  de 26 / 32 / 40 px (`--control-h-xs|sm|md`).

En Tailwind solo se mapean `rounded-xs` y `rounded-sm` (sus valores coinciden con los de
Tailwind); para los demás usa la variable: `rounded-[var(--radius-pill)]`.
</docs>
