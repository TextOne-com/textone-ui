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
              Pasa el mouse por el riel: se abre sobre la página y se cierra al elegir un ítem o al
              salir. El botón del pie lo fija abierto.
            </template>
            <template v-else>Colapsa con el botón del pie o con ⌘/Ctrl+B; la página se corre.</template>
          </p>
          <TxButton variant="default" size="xs" @click="state.pending++">Nueva solicitud (+1)</TxButton>
          <TxButton variant="subtle" size="xs" @click="state.pending = Math.max(0, state.pending - 1)">Aprobar una (−1)</TxButton>
        </div>
      </div>
      <template #controls>
        <HstButtonGroup v-model="state.behavior" title="behavior" :options="['hover', 'toggle']" />
        <HstNumber v-model="state.pending" title="Pendientes (badge)" :min="0" />
      </template>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxSidebar

La navegación de una herramienta interna: grupos de destinos con **ícono y título** sobre un
**riel de íconos** (64 px). Una píldora morada **se desliza** al ítem activo, los títulos se
desvanecen al colapsar y un contador **late una vez** cuando cambia.

## Dos comportamientos

| `behavior` | Cómo se abre | Cómo se cierra | La página |
|---|---|---|---|
| **`hover`** (recomendado) | Mouse encima (90 ms), o foco con teclado | Al **elegir un destino**, al salir el mouse (180 ms) o con Escape | **No se mueve**: el menú se abre por encima |
| `toggle` | Botón del pie o ⌘/Ctrl+B | Igual | Se corre para hacerle lugar |

En `hover`, el botón del pie **fija** el menú abierto (y se recuerda); fijado, se comporta como
abierto en `toggle`. En pantallas táctiles (sin hover) `hover` se comporta como `toggle`.

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

Dentro de `TxAppShell`, usa `navbar-width="auto"` para que la columna siga el ancho del menú.

## TxSidebar

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `behavior` | `hover \| toggle` | `toggle` | Ver arriba |
| `collapsed` | `boolean` (`v-model:collapsed`) | — | Solo `toggle`. Si no se enlaza, el menú decide: lo que eligió la persona, o el riel en pantallas angostas |
| `width` / `collapsedWidth` | `number` | `232` / `64` | px |
| `storageKey` | `string` | `"tx-sidebar-collapsed"` | Dónde se recuerda la elección: colapsado (`toggle`) o fijado (`hover`, con sufijo `-pinned`). `""` para no recordar |
| `autoCollapseBelow` | `number` | `1200` | Solo `toggle`: por debajo de este ancho, riel (`0` lo desactiva) |
| `shortcut` | `boolean` | `true` | Solo `toggle`: ⌘/Ctrl+B — nunca mientras se escribe en un campo |
| `pinLabel` / `unpinLabel` | `string` | `"Fijar menú abierto"` / `"Soltar menú"` | Solo `hover` |
| `label` | `string` | `"Principal"` | Nombre accesible del `<nav>` |
| `collapseLabel` / `expandLabel` | `string` | `"Colapsar menú"` / `"Expandir menú"` | |

**Slots:** por defecto (grupos), `footer` (solo visible expandido).

## TxSidebarGroup

`label` — el título del grupo. Colapsado se vuelve una línea fina en el mismo espacio, así nada
salta de lugar.

## TxSidebarItem

| Prop | Tipo | |
|---|---|---|
| `label` | `string` (requerido) | Título; colapsado sigue siendo el nombre accesible (y en `toggle`, el tooltip) |
| `active` | `boolean` | Pone `aria-current="page"` y mueve la píldora aquí. Elegir un ítem cierra el menú en `hover` |
| `as` | `string \| Component` | `RouterLink`, `"a"`, `"button"`; sus atributos (`to`, `href`) pasan al enlace |
| `badge` | `number \| string` | Contador; `0` o vacío no se muestra |
| `badgeLabel` | `string` | Lo que oye un lector de pantalla: "2 pendientes" |

**Slot:** `icon` — un ícono de Tabler con `stroke="2"` (manual, diapositiva 14).

## Movimiento

Ancho 220 ms, títulos 160 ms, píldora 260 ms, todos con la misma curva suave; el ícono se
desplaza 2 px al pasar el mouse. Con *reducir movimiento* activado en el sistema, todo cambia sin
animación.
</docs>
