<script setup lang="ts">
import {
  IconArrowsExchange,
  IconBooks,
  IconChecklist,
  IconFileSearch,
  IconLayoutDashboard,
  IconPackages,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-vue";
import { TxButton, TxSidebar, TxSidebarGroup, TxSidebarItem } from "@textone-com/vue";
import { type Component, reactive, ref } from "vue";

type Item = { id: string; label: string; icon: Component };
const groups: { label: string; items: Item[] }[] = [
  {
    label: "Saldos",
    items: [
      { id: "panel", label: "Panel de control", icon: IconLayoutDashboard },
      { id: "cuentas", label: "Cuentas", icon: IconUsers },
      { id: "remision", label: "Nueva remisión", icon: IconTruckDelivery },
      { id: "buscar", label: "Buscar documento", icon: IconFileSearch },
      { id: "aprobaciones", label: "Aprobaciones", icon: IconChecklist },
    ],
  },
  {
    label: "Inventarios",
    items: [
      { id: "existencias", label: "Existencias", icon: IconPackages },
      { id: "registrar", label: "Registrar movimiento", icon: IconArrowsExchange },
      { id: "catalogo", label: "Catálogo", icon: IconBooks },
    ],
  },
];

const state = reactive({ behavior: "hover" as "hover" | "toggle", pending: 2 });
const active = ref("panel");
</script>

<template>
  <Story title="TxSidebar" group="estructura">
    <Variant title="Playground" :init-state="() => state">
      <div style="display: flex; height: 600px; background: var(--canvas)">
        <div style="border-right: 1px solid var(--rule-strong); position: relative; z-index: 2">
          <TxSidebar :key="state.behavior" :behavior="state.behavior" storage-key="" :auto-collapse-below="0">
            <TxSidebarGroup v-for="g in groups" :key="g.label" :label="g.label">
              <TxSidebarItem
                v-for="item in g.items"
                :key="item.id"
                as="button"
                type="button"
                :label="item.label"
                :active="active === item.id"
                :badge="item.id === 'aprobaciones' ? state.pending : undefined"
                :badge-label="`${state.pending} pendientes`"
                @click="active = item.id"
              >
                <template #icon><component :is="item.icon" stroke="2" /></template>
              </TxSidebarItem>
            </TxSidebarGroup>
            <template #footer>Entorno de desarrollo.</template>
          </TxSidebar>
        </div>
        <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
          <p class="story-note">
            <template v-if="state.behavior === 'hover'">
              Hover over the rail: it opens over the page and closes when you choose an item or
              leave. The footer button pins it open.
            </template>
            <template v-else>Collapse it with the footer button or with ⌘/Ctrl+B; the page shifts.</template>
          </p>
          <TxButton variant="default" size="xs" @click="state.pending++">New request (+1)</TxButton>
          <TxButton variant="subtle" size="xs" @click="state.pending = Math.max(0, state.pending - 1)">Approve one (−1)</TxButton>
        </div>
      </div>
      <template #controls>
        <HstButtonGroup v-model="state.behavior" title="behavior" :options="['hover', 'toggle']" />
        <HstNumber v-model="state.pending" title="Pending (badge)" :min="0" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxSidebar

An internal tool's navigation: groups of destinations with **icon and title** over an **icon
rail** (64 px). A purple pill **slides** to the active item, titles fade out when collapsing and a
counter **pulses once** when it changes.

## Two behaviors

| `behavior` | How it opens | How it closes | The page |
|---|---|---|---|
| **`hover`** (recommended) | Mouse over (90 ms), or keyboard focus | On **choosing a destination**, when the mouse leaves (180 ms) or with Escape | **Does not move**: the menu opens on top of it |
| `toggle` | Footer button or ⌘/Ctrl+B | Same | Shifts to make room |

In `hover`, the footer button **pins** the menu open (and it is remembered); pinned, it behaves
like an open `toggle`. On touch screens (no hover) `hover` behaves like `toggle`.

```vue
<TxSidebar behavior="hover">
  <TxSidebarGroup label="Saldos">
    <TxSidebarItem
      :as="RouterLink"
      to="/aprobaciones"
      label="Aprobaciones"
      :active="route.path.startsWith('/aprobaciones')"
      :badge="pending"
      :badge-label="`${pending} pendientes`"
    >
      <template #icon><IconChecklist stroke="2" /></template>
    </TxSidebarItem>
  </TxSidebarGroup>
  <template #footer>Entorno de desarrollo.</template>
</TxSidebar>
```

Inside `TxAppShell`, use `navbar-width="auto"` so the column follows the menu's width.

## TxSidebar

| Prop | Type | Default | |
|---|---|---|---|
| `behavior` | `hover \| toggle` | `toggle` | See above |
| `collapsed` | `boolean` (`v-model:collapsed`) | — | `toggle` only. If not bound, the menu decides: what the person chose, or the rail on narrow screens |
| `width` / `collapsedWidth` | `number` | `232` / `64` | px |
| `storageKey` | `string` | `"tx-sidebar-collapsed"` | Where the choice is remembered: collapsed (`toggle`) or pinned (`hover`, with a `-pinned` suffix). `""` to not remember |
| `autoCollapseBelow` | `number` | `1200` | `toggle` only: below this width, rail (`0` disables it) |
| `shortcut` | `boolean` | `true` | `toggle` only: ⌘/Ctrl+B — never while typing in a field |
| `pinLabel` / `unpinLabel` | `string` | `"Fijar menú abierto"` / `"Soltar menú"` | `hover` only |
| `label` | `string` | `"Principal"` | The `<nav>`'s accessible name |
| `collapseLabel` / `expandLabel` | `string` | `"Colapsar menú"` / `"Expandir menú"` | |

**Slots:** default (groups), `footer` (visible only when expanded).

## TxSidebarGroup

`label` — the group's title. Collapsed, it becomes a thin line in the same space, so nothing
jumps.

## TxSidebarItem

| Prop | Type | |
|---|---|---|
| `label` | `string` (required) | Title; collapsed, it is still the accessible name (and in `toggle`, the tooltip) |
| `active` | `boolean` | Sets `aria-current="page"` and moves the pill here. Choosing an item closes the menu in `hover` |
| `as` | `string \| Component` | `RouterLink`, `"a"`, `"button"`; its attributes (`to`, `href`) pass through to the link |
| `badge` | `number \| string` | Counter; `0` or empty is not shown |
| `badgeLabel` | `string` | What a screen reader hears: "2 pendientes" |

**Slot:** `icon` — a Tabler icon with `stroke="2"` (brand manual, slide 14).

## Motion

Width 220 ms, titles 160 ms, pill 260 ms, all on the same soft curve; the icon shifts 2 px on
hover. With *reduce motion* enabled in the OS, everything changes without animation.
</docs>
