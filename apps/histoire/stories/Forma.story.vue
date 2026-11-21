<script setup lang="ts">
const spaces = [1, 2, 3, 4, 5, 6, 8];
const radii = [
  { name: "radius-xs", use: "Minimal details" },
  { name: "radius-sm", use: "Cards, panels, tables" },
  { name: "radius-control", use: "Fields, menus" },
  { name: "radius-lg", use: "Dialogs" },
  { name: "radius-pill", use: "Buttons, chips, navigation" },
];
</script>

<template>
  <Story title="Spacing & shape" group="fundamentos" :layout="{ type: 'single', iframe: false }">
    <div class="story-col" style="max-width: 760px">
      <h2 class="tx-title tx-title--3">Spacing — 4 px grid</h2>
      <div style="display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap">
        <div v-for="n in spaces" :key="n" style="display: flex; flex-direction: column; align-items: center; gap: 4px">
          <div :style="{ width: `var(--space-${n})`, height: `var(--space-${n})`, background: 'var(--brand-100)' }" />
          <code style="font-size: 11px; color: var(--ink-secondary)">--space-{{ n }}</code>
        </div>
      </div>

      <h2 class="tx-title tx-title--3">Radii</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <div v-for="r in radii" :key="r.name" style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start">
          <div :style="{ width: '96px', height: '48px', background: 'var(--surface)', border: '1px solid var(--rule-strong)', borderRadius: `var(--${r.name})` }" />
          <code style="font-size: 11px">--{{ r.name }}</code>
          <small style="font-size: 11px; color: var(--ink-secondary)">{{ r.use }}</small>
        </div>
      </div>

      <h2 class="tx-title tx-title--3">Depth</h2>
      <div style="display: flex; gap: 24px">
        <div style="width: 160px; height: 72px; background: var(--surface); border: 1px solid var(--rule-strong); border-radius: var(--radius-sm); display: grid; place-items: center; font-size: 12px">Border (everything)</div>
        <div style="width: 160px; height: 72px; background: var(--surface); box-shadow: var(--shadow-overlay); border-radius: var(--radius-control); display: grid; place-items: center; font-size: 12px">--shadow-overlay (what floats)</div>
      </div>
    </div>
  </Story>
</template>

<docs lang="md">
# Spacing and shape

- **4 px grid:** `--space-1` (4) … `--space-8` (32).
- **The public site's shape:** nearly square cards and tables (4 px), rounded fields (8 px),
  12 px dialogs, and **pill-shaped buttons, chips and navigation**.
- **Borders before shadows.** The only shadow, `--shadow-overlay` (tinted purple), is for what
  floats: menus, the calendar, dialogs.
- **Density:** 28 px rows (`--row-h-compact`) in tables of figures and 36 px in lists; controls
  of 26 / 32 / 40 px (`--control-h-xs|sm|md`).

Tailwind maps only `rounded-xs` and `rounded-sm` (their values match Tailwind's); for the rest use
the variable: `rounded-[var(--radius-pill)]`.
</docs>
