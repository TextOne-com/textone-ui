<script setup lang="ts" generic="Row">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import DataTableFilter from "../internal/DataTableFilter.vue";
import {
  type CellValue,
  type DataColumn,
  defaultLayout,
  type Filters,
  type FilterValue,
  filterRows,
  isActive,
  orderColumns,
  readViews,
  type SavedView,
  type SortState,
  snapshotView,
  sortRows,
  type TableLayout,
  toCsv,
  upsertView,
  viewMatches,
} from "../utils/dataTable";
import TxButton from "./TxButton.vue";
import TxIconButton from "./TxIconButton.vue";
import TxPopover from "./TxPopover.vue";
import TxSegmentedControl from "./TxSegmentedControl.vue";
import TxSelect from "./TxSelect.vue";
import TxTextInput from "./TxTextInput.vue";

/**
 * A table people shape to their work. Each column can be resized (drag its edge, or arrows on
 * the focused edge; double-click resets), pinned to the left, hidden, sorted and filtered (text,
 * options or a min–max range) from its header menu. "Columnas" lists them all; the density
 * switches between compact and comfortable; "Exportar" downloads the view as CSV for Excel.
 * Sizes, pins, hidden columns and density are remembered per person and per `storageKey`.
 *
 * Rows glide when filtering or sorting reorders them (`tx-row`). On a phone what is pinned never
 * takes more than 45 % of the width, so the other columns stay readable.
 *
 * `groupBy` sets rows under headings (a catalog's sections), in the order the groups first appear
 * in `rows`; sorting and filtering happen inside each group, and the export adds the group as its
 * first column (`groupHeader`).
 *
 * With a `card` slot, a frame narrower than 640 px shows one card per row instead of the table:
 * a list people scan on a phone. Headers are gone there, so "Filtros" holds the order and every
 * column's filter; "Columnas" is left out (the card decides what it shows).
 *
 * With `viewsKey`, "Vistas" saves the current filters, order and columns under a name and brings
 * them back ("Cuentas con saldo > $10 M"). Views live in this browser, under that key — give it
 * the person's id to keep each person's apart.
 *
 * Slots: `cell-<id>` ({ row, value }), `foot-<id>` (the totals row), `toolbar`
 * ({ shown, total }), `group` ({ group, count }), `card` ({ row }), `empty`.
 */
const props = withDefaults(
  defineProps<{
    rows: Row[];
    columns: DataColumn<Row>[];
    rowKey: (row: Row) => string | number;
    /** localStorage key for the layout; "" to remember nothing. */
    storageKey?: string;
    maxHeight?: string;
    /** File name for "Exportar" (without .csv); no button without it. */
    exportName?: string;
    label?: string;
    emptyText?: string;
    animate?: boolean;
    groupBy?: (row: Row) => { id: string | number; label: string; detail?: string };
    /** The group's column header in the export. */
    groupHeader?: string;
    /** localStorage key for saved views; "" (the default) shows no "Vistas". */
    viewsKey?: string;
  }>(),
  { storageKey: "", emptyText: "Ninguna fila coincide.", animate: true, viewsKey: "" },
);
const slots = useSlots();
const sort = defineModel<SortState>("sort", { default: null });
const filters = defineModel<Filters>("filters", { default: () => ({}) });

// ── Layout, remembered ───────────────────────────────────────────────────
const key = computed(() => (props.storageKey ? `tx-table:${props.storageKey}` : ""));
function readLayout(): TableLayout {
  const base = defaultLayout(props.columns);
  if (!key.value) return base;
  try {
    const stored = JSON.parse(localStorage.getItem(key.value) ?? "null") as Partial<TableLayout> | null;
    if (!stored) return base;
    const ids = new Set(props.columns.map((c) => c.id));
    return {
      sizes: { ...base.sizes, ...stored.sizes },
      pinned: (stored.pinned ?? base.pinned).filter((id) => ids.has(id)),
      hidden: (stored.hidden ?? []).filter((id) => ids.has(id)),
      density: stored.density ?? base.density,
    };
  } catch {
    return base;
  }
}
const layout = ref<TableLayout>(readLayout());
watch(
  layout,
  (value) => {
    if (!key.value) return;
    try {
      localStorage.setItem(key.value, JSON.stringify(value));
    } catch {
      // Storage blocked: the layout lasts for this page.
    }
  },
  { deep: true },
);
function resetLayout() {
  layout.value = defaultLayout(props.columns);
}

// ── What is shown ────────────────────────────────────────────────────────
const shownRows = computed(() =>
  sortRows(filterRows(props.rows, props.columns, filters.value), props.columns, sort.value),
);
const visible = computed(() => orderColumns(props.columns, layout.value));

type Group = { id: string | number; label: string; detail?: string };
type Item =
  | { kind: "group"; key: string; group: Group; count: number }
  | { kind: "row"; key: string; row: Row; i: number };
/** Rows, or headings and rows: one keyed list, so a filter can move rows under their heading. */
const items = computed<Item[]>(() => {
  const groupBy = props.groupBy;
  if (!groupBy) return shownRows.value.map((row, i) => ({ kind: "row", key: `r:${props.rowKey(row)}`, row, i }));
  const order = new Map<string | number, Group>();
  for (const row of props.rows) {
    const g = groupBy(row);
    if (!order.has(g.id)) order.set(g.id, g);
  }
  const buckets = new Map<string | number, Row[]>();
  for (const row of shownRows.value) {
    const id = groupBy(row).id;
    const list = buckets.get(id);
    if (list) list.push(row);
    else buckets.set(id, [row]);
  }
  const out: Item[] = [];
  for (const [id, group] of order) {
    const list = buckets.get(id);
    if (!list?.length) continue;
    out.push({ kind: "group", key: `g:${id}`, group, count: list.length });
    list.forEach((row, i) => out.push({ kind: "row", key: `r:${props.rowKey(row)}`, row, i }));
  }
  return out;
});

const root = ref<HTMLElement>();
const wrap = ref<HTMLElement>();
const wrapWidth = ref(0);
const scrolled = ref(false);
const narrow = computed(() => wrapWidth.value > 0 && wrapWidth.value < 640);
/** One card per row: on a narrow frame, when the page says how a row reads as a card. */
const cards = computed(() => narrow.value && Boolean(slots.card));

/** Pinned columns that really stick: on a phone, only as many as fit in 45 % of the width. */
const stuck = computed(() => {
  const out: { id: string; left: number }[] = [];
  let left = 0;
  const budget = narrow.value ? wrapWidth.value * 0.45 : Number.POSITIVE_INFINITY;
  for (const c of visible.value) {
    if (!layout.value.pinned.includes(c.id)) break;
    const w = widthOf(c);
    if (left + w > budget && out.length) break;
    out.push({ id: c.id, left });
    left += w;
  }
  return out;
});
const stuckIds = computed(() => new Map(stuck.value.map((s) => [s.id, s.left])));
const lastStuck = computed(() => stuck.value.at(-1)?.id);

function widthOf(c: DataColumn<Row>): number {
  const w = layout.value.sizes[c.id] ?? c.width ?? 140;
  // A pinned column on a phone gives up width rather than the screen.
  if (narrow.value && layout.value.pinned[0] === c.id) return Math.min(w, Math.round(wrapWidth.value * 0.45));
  return w;
}
const tableWidth = computed(() => visible.value.reduce((n, c) => n + widthOf(c), 0));

function cellStyle(c: DataColumn<Row>) {
  const left = stuckIds.value.get(c.id);
  return left === undefined ? undefined : { left: `${left}px` };
}

// ── Resizing ─────────────────────────────────────────────────────────────
let drag: { id: string; x: number; w: number; min: number } | null = null;
function startResize(event: PointerEvent, c: DataColumn<Row>) {
  event.preventDefault();
  drag = { id: c.id, x: event.clientX, w: widthOf(c), min: c.minWidth ?? 64 };
  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
}
function onResize(event: PointerEvent) {
  if (!drag) return;
  const next = Math.min(800, Math.max(drag.min, Math.round(drag.w + event.clientX - drag.x)));
  layout.value.sizes[drag.id] = next;
}
function endResize() {
  drag = null;
}
function resizeBy(c: DataColumn<Row>, delta: number) {
  layout.value.sizes[c.id] = Math.min(800, Math.max(c.minWidth ?? 64, widthOf(c) + delta));
}
function resetWidth(c: DataColumn<Row>) {
  layout.value.sizes[c.id] = c.width ?? 140;
}

// ── Pins, visibility, sort, filters ─────────────────────────────────────
function togglePin(id: string) {
  const pinned = layout.value.pinned;
  layout.value.pinned = pinned.includes(id) ? pinned.filter((p) => p !== id) : [...pinned, id];
}
function toggleHidden(id: string) {
  const hidden = layout.value.hidden;
  layout.value.hidden = hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id];
}
function setSort(id: string, desc: boolean | null) {
  sort.value = desc === null ? null : { id, desc };
}
function cycleSort(c: DataColumn<Row>) {
  if (c.sortable === false) return;
  const current = sort.value?.id === c.id ? sort.value : null;
  // Figures start high-to-low (what matters first); words A–Z.
  const firstDesc = c.align === "right";
  if (!current) setSort(c.id, firstDesc);
  else if (current.desc === firstDesc) setSort(c.id, !firstDesc);
  else setSort(c.id, null);
}
function ariaSort(c: DataColumn<Row>) {
  if (sort.value?.id !== c.id) return c.sortable === false ? undefined : "none";
  return sort.value.desc ? "descending" : "ascending";
}

function filterOf(c: DataColumn<Row>): FilterValue {
  const f = filters.value[c.id];
  if (f) return f;
  if (c.filter === "options") return { kind: "options", values: [] };
  if (c.filter === "range") return { kind: "range" };
  return { kind: "text", text: "" };
}
function setFilter(c: DataColumn<Row>, value: FilterValue) {
  const next = { ...filters.value };
  if (isActive(value)) next[c.id] = value;
  else delete next[c.id];
  filters.value = next;
}
function clearFilters() {
  filters.value = {};
}
function optionsOf(c: DataColumn<Row>) {
  if (c.options) return c.options;
  const seen = new Map<string, string>();
  for (const row of props.rows) {
    const v = c.value(row);
    if (v === null || v === undefined || v === "") continue;
    seen.set(String(v), c.format ? c.format(v) : String(v));
  }
  return [...seen].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, "es"));
}

/** As cards, the order is chosen from a list: each sortable column, either way. */
const sortOptions = computed(() =>
  props.columns
    .filter((c) => c.sortable !== false)
    .flatMap((c) =>
      c.align === "right"
        ? [
            { value: `${c.id}:desc`, label: `${c.header}: mayor a menor` },
            { value: `${c.id}:asc`, label: `${c.header}: menor a mayor` },
          ]
        : [
            { value: `${c.id}:asc`, label: `${c.header}: A → Z` },
            { value: `${c.id}:desc`, label: `${c.header}: Z → A` },
          ],
    ),
);
const sortChoice = computed({
  get: () => (sort.value ? `${sort.value.id}:${sort.value.desc ? "desc" : "asc"}` : null),
  set: (v: string | null) => {
    if (!v) return setSort("", null);
    const [id, dir] = v.split(":");
    setSort(id as string, dir === "desc");
  },
});
const filterable = computed(() => props.columns.filter((c) => c.filter));
function chipText(c: DataColumn<Row>, f: FilterValue): string {
  const fmt = (t: string) => {
    if (!c.format) return t;
    const parsed = c.parse ? c.parse(t) : t;
    return parsed === null ? t : c.format(parsed);
  };
  if (f.kind === "text") return `${c.header}: «${f.text}»`;
  if (f.kind === "options") {
    const labels = optionsOf(c).filter((o) => f.values.includes(o.value)).map((o) => o.label);
    return `${c.header}: ${labels.length > 2 ? `${labels.length} elegidos` : labels.join(", ")}`;
  }
  if (f.min && f.max) return `${c.header}: ${fmt(f.min)} – ${fmt(f.max)}`;
  return f.min ? `${c.header} ≥ ${fmt(f.min)}` : `${c.header} ≤ ${fmt(f.max ?? "")}`;
}
const activeFilters = computed(() =>
  props.columns.filter((c) => isActive(filters.value[c.id])).map((c) => ({ c, f: filters.value[c.id] as FilterValue })),
);

// ── Saved views ──────────────────────────────────────────────────────────
const viewsStorage = computed(() => (props.viewsKey ? `tx-table-views:${props.viewsKey}` : ""));
function loadViews(): SavedView[] {
  if (!viewsStorage.value) return [];
  try {
    return readViews(localStorage.getItem(viewsStorage.value), new Set(props.columns.map((c) => c.id)));
  } catch {
    return [];
  }
}
const views = ref<SavedView[]>(loadViews());
watch(viewsStorage, () => {
  views.value = loadViews();
});
function storeViews(next: SavedView[]) {
  views.value = next;
  if (!viewsStorage.value) return;
  try {
    localStorage.setItem(viewsStorage.value, JSON.stringify(next));
  } catch {
    // Storage blocked: the views last for this page.
  }
}
const viewName = ref("");
const viewsOpen = ref(false);
const currentView = computed(() =>
  views.value.find((v) => viewMatches(v, filters.value, sort.value, layout.value)),
);
function saveView() {
  const name = viewName.value.trim();
  if (!name) return;
  storeViews(upsertView(views.value, snapshotView(name, filters.value, sort.value, layout.value)));
  viewName.value = "";
}
function applyView(view: SavedView) {
  filters.value = JSON.parse(JSON.stringify(view.filters)) as Filters;
  sort.value = view.sort ? { ...view.sort } : null;
  layout.value.hidden = [...view.hidden];
  layout.value.pinned = [...view.pinned];
  viewsOpen.value = false;
}
function deleteView(view: SavedView) {
  storeViews(views.value.filter((v) => v !== view));
}

// ── Export ───────────────────────────────────────────────────────────────
function exportCsv() {
  const groupBy = props.groupBy;
  const exported = items.value.flatMap((it) => (it.kind === "row" ? [it.row] : []));
  const columns = groupBy
    ? [
        { id: "__group", header: props.groupHeader ?? "Grupo", value: (r: Row) => groupBy(r).label } as DataColumn<Row>,
        ...visible.value,
      ]
    : visible.value;
  const csv = toCsv(exported, columns);
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.exportName}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Size of the frame ────────────────────────────────────────────────────
let observer: ResizeObserver | undefined;
let frame = 0;
function onScroll() {
  scrolled.value = (wrap.value?.scrollLeft ?? 0) > 0;
}
// The whole component is measured, not the table's frame: as cards, there is no table.
onMounted(() => {
  if (!root.value) return;
  wrapWidth.value = root.value.clientWidth;
  if (typeof ResizeObserver === "function") {
    // Measured on the next frame and only when it changed: the width decides the layout, and
    // setting it inside the observer's own callback would loop.
    observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = root.value?.clientWidth ?? 0;
        if (Math.abs(next - wrapWidth.value) > 1) wrapWidth.value = next;
      });
    });
    observer.observe(root.value);
  }
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
});

const densityOptions = [
  { value: "compact", label: "Compacta" },
  { value: "comfortable", label: "Cómoda" },
];
const density = computed({
  get: () => layout.value.density,
  set: (v: string) => {
    layout.value.density = v as TableLayout["density"];
  },
});
const valueOf = (c: DataColumn<Row>, row: Row): CellValue => c.value(row);
</script>

<template>
  <div ref="root" class="tx-dt" :data-density="layout.density" :data-cards="cards || undefined">
    <div class="tx-dt__toolbar">
      <div class="tx-dt__toolbar-start">
        <slot name="toolbar" :shown="shownRows.length" :total="rows.length" />
      </div>
      <div class="tx-dt__toolbar-end">
        <TxPopover v-if="viewsKey" v-model:open="viewsOpen" align="end" :width="300" label="Vistas">
          <template #trigger>
            <button type="button" class="tx-dt__tool" :data-active="currentView ? true : undefined">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L4.5 10l5.2-.8z" /></svg>
              <span class="tx-dt__tool-text">{{ currentView ? currentView.name : "Vistas" }}</span>
            </button>
          </template>
          <div class="tx-dt__menu">
            <p class="tx-dt__menu-title">Vistas guardadas</p>
            <p v-if="!views.length" class="tx-dt__menu-note">
              Guarde los filtros, el orden y las columnas de ahora con un nombre, para volver a ellos.
            </p>
            <ul v-else class="tx-dt__views">
              <li v-for="v in views" :key="v.name" :data-current="v === currentView || undefined">
                <button type="button" class="tx-dt__item" :aria-current="v === currentView || undefined" @click="applyView(v)">
                  {{ v.name }}
                </button>
                <TxIconButton :label="`Borrar la vista ${v.name}`" size="xs" @click="deleteView(v)">
                  <svg class="tx-dt__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
                </TxIconButton>
              </li>
            </ul>
            <form class="tx-dt__save-view" @submit.prevent="saveView">
              <TxTextInput v-model="viewName" aria-label="Nombre de la vista" placeholder="Nombre de la vista" size="xs" />
              <TxButton type="submit" size="xs" :disabled="!viewName.trim()">Guardar</TxButton>
            </form>
          </div>
        </TxPopover>
        <TxPopover v-if="cards && (sortOptions.length || filterable.length)" align="end" :width="320" label="Ordenar y filtrar">
          <template #trigger>
            <button
              type="button"
              class="tx-dt__tool"
              :aria-label="activeFilters.length ? `Filtros, ${activeFilters.length} ${activeFilters.length === 1 ? 'activo' : 'activos'}` : undefined"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              Filtros<span v-if="activeFilters.length" class="tx-dt__count" aria-hidden="true">{{ activeFilters.length }}</span>
            </button>
          </template>
          <div class="tx-dt__menu">
            <TxSelect
              v-if="sortOptions.length"
              v-model="sortChoice"
              :options="sortOptions"
              label="Ordenar por"
              placeholder="Sin orden"
              size="xs"
              clearable
            />
            <div v-for="c in filterable" :key="c.id" class="tx-dt__card-filter">
              <p class="tx-dt__menu-title">{{ c.header }}</p>
              <DataTableFilter :column="c" :value="filterOf(c)" :options="c.filter === 'options' ? optionsOf(c) : []" @change="(v) => setFilter(c, v)" />
            </div>
          </div>
        </TxPopover>
        <TxPopover v-if="!cards" align="end" :width="300" label="Columnas">
          <template #trigger>
            <button type="button" class="tx-dt__tool">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM10 5v14M15 5v14" /></svg>
              Columnas
            </button>
          </template>
          <div class="tx-dt__menu">
            <p class="tx-dt__menu-title">Columnas</p>
            <div v-for="c in columns" :key="c.id" class="tx-dt__col-row">
              <label class="tx-dt__check">
                <input
                  type="checkbox"
                  :checked="!layout.hidden.includes(c.id)"
                  :disabled="c.hideable === false"
                  @change="toggleHidden(c.id)"
                />
                <span>{{ c.header }}</span>
              </label>
              <button
                type="button"
                class="tx-dt__pin"
                :aria-pressed="layout.pinned.includes(c.id)"
                :aria-label="layout.pinned.includes(c.id) ? `Soltar ${c.header}` : `Fijar ${c.header}`"
                :title="layout.pinned.includes(c.id) ? 'Soltar' : 'Fijar a la izquierda'"
                @click="togglePin(c.id)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.5l-4 4-4 1.5-1.5 1.5 7 7 1.5-1.5 1.5-4 4-4M9 15l-4.5 4.5M14.5 4l5.5 5.5" /></svg>
              </button>
            </div>
            <div class="tx-dt__menu-row">
              <span class="tx-dt__menu-label">Densidad</span>
              <TxSegmentedControl v-model="density" :options="densityOptions" size="xs" label="Densidad" />
            </div>
            <TxButton variant="subtle" size="xs" @click="resetLayout">Restablecer columnas</TxButton>
          </div>
        </TxPopover>
        <button v-if="exportName" type="button" class="tx-dt__tool" @click="exportCsv">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" /></svg>
          Exportar
        </button>
      </div>
    </div>

    <TransitionGroup v-if="activeFilters.length" tag="div" name="tx-chip" class="tx-dt__chips">
      <span v-for="a in activeFilters" :key="a.c.id" class="tx-dt__chip">
        {{ chipText(a.c, a.f) }}
        <button type="button" :aria-label="`Quitar filtro de ${a.c.header}`" @click="setFilter(a.c, { kind: 'text', text: '' })">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
      </span>
      <button key="clear" type="button" class="tx-dt__clear-all" @click="clearFilters">Quitar filtros</button>
    </TransitionGroup>

    <template v-if="cards">
      <TransitionGroup v-if="shownRows.length" tag="ul" name="tx-row" :css="animate" appear class="tx-dt__cards" :aria-label="label">
        <li
          v-for="item in items"
          :key="item.key"
          :class="item.kind === 'group' ? 'tx-dt__card-group' : 'tx-dt__card'"
          :style="item.kind === 'row' ? { '--tx-i': Math.min(item.i, 12) } : undefined"
        >
          <template v-if="item.kind === 'group'">
            <slot name="group" :group="item.group" :count="item.count">
              {{ item.group.label }}
              <span class="tx-dt__group-detail">
                {{ [item.group.detail, item.count].filter((x) => x !== undefined && x !== "").join(" · ") }}
              </span>
            </slot>
          </template>
          <slot v-else name="card" :row="item.row" />
        </li>
      </TransitionGroup>
      <div v-else class="tx-dt__empty tx-dt__empty--cards">
        <slot name="empty" :clear="clearFilters">
          {{ emptyText }}
          <TxButton v-if="activeFilters.length" variant="subtle" size="xs" @click="clearFilters">Quitar filtros</TxButton>
        </slot>
      </div>
    </template>
    <div
      v-else
      ref="wrap"
      class="tx-table-wrap tx-table-wrap--framed tx-dt__wrap"
      :style="maxHeight ? { maxHeight } : undefined"
      :data-scrolled="scrolled || undefined"
      :role="label ? 'region' : undefined"
      :aria-label="label"
      :tabindex="label ? 0 : undefined"
      @scroll.passive="onScroll"
    >
      <table class="tx-table tx-table--framed tx-dt__table" :style="{ width: `${tableWidth}px` }">
        <colgroup>
          <col v-for="c in visible" :key="c.id" :style="{ width: `${widthOf(c)}px` }" />
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="c in visible"
              :key="c.id"
              :data-align="c.align"
              :data-stuck="stuckIds.has(c.id) || undefined"
              :data-last-stuck="lastStuck === c.id || undefined"
              :data-filtered="isActive(filters[c.id]) || undefined"
              :aria-sort="ariaSort(c)"
              :style="cellStyle(c)"
            >
              <div class="tx-dt__head">
                <button
                  v-if="c.sortable !== false"
                  type="button"
                  class="tx-dt__sort"
                  :data-active="sort?.id === c.id || undefined"
                  @click="cycleSort(c)"
                >
                  <span class="tx-dt__label">{{ c.header }}</span>
                  <svg class="tx-dt__arrow" viewBox="0 0 24 24" aria-hidden="true" :data-up="(sort?.id === c.id && !sort.desc) || undefined">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </button>
                <span v-else class="tx-dt__label">{{ c.header }}</span>
                <TxPopover :width="260" align="end" :label="`Opciones de ${c.header}`">
                  <template #trigger>
                    <button type="button" class="tx-dt__menu-btn" :aria-label="`Opciones de ${c.header}`">
                      <span v-if="isActive(filters[c.id])" class="tx-dt__dot" aria-hidden="true" />
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="6" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="18" r="1.4" /></svg>
                    </button>
                  </template>
                  <div class="tx-dt__menu">
                    <template v-if="c.sortable !== false">
                      <button type="button" class="tx-dt__item" @click="setSort(c.id, c.align !== 'right')">
                        {{ c.align === "right" ? "Mayor a menor" : "A → Z" }}
                      </button>
                      <button type="button" class="tx-dt__item" @click="setSort(c.id, c.align === 'right')">
                        {{ c.align === "right" ? "Menor a mayor" : "Z → A" }}
                      </button>
                    </template>
                    <template v-if="c.filter">
                      <p class="tx-dt__menu-title">Filtrar</p>
                      <DataTableFilter :column="c" :value="filterOf(c)" :options="c.filter === 'options' ? optionsOf(c) : []" @change="(v) => setFilter(c, v)" />
                    </template>
                    <hr class="tx-dt__rule" />
                    <button type="button" class="tx-dt__item" @click="togglePin(c.id)">
                      {{ layout.pinned.includes(c.id) ? "Soltar columna" : "Fijar a la izquierda" }}
                    </button>
                    <button v-if="c.hideable !== false" type="button" class="tx-dt__item" @click="toggleHidden(c.id)">
                      Ocultar columna
                    </button>
                    <button type="button" class="tx-dt__item" @click="resetWidth(c)">Ancho original</button>
                  </div>
                </TxPopover>
              </div>
              <span
                class="tx-dt__resize"
                role="separator"
                aria-orientation="vertical"
                :aria-label="`Ancho de ${c.header}`"
                :aria-valuenow="widthOf(c)"
                :aria-valuemin="c.minWidth ?? 64"
                aria-valuemax="800"
                tabindex="0"
                @pointerdown="startResize($event, c)"
                @pointermove="onResize"
                @pointerup="endResize"
                @pointercancel="endResize"
                @dblclick="resetWidth(c)"
                @keydown.left.prevent="resizeBy(c, -16)"
                @keydown.right.prevent="resizeBy(c, 16)"
              />
            </th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="tx-row" :css="animate" appear>
          <tr
            v-for="item in items"
            :key="item.key"
            :class="item.kind === 'group' ? 'tx-dt__group' : undefined"
            :style="item.kind === 'row' ? { '--tx-i': Math.min(item.i, 12) } : undefined"
          >
            <td v-if="item.kind === 'group'" :colspan="visible.length">
              <span class="tx-dt__group-label">
                <slot name="group" :group="item.group" :count="item.count">
                  {{ item.group.label }}
                  <span class="tx-dt__group-detail">
                    {{ [item.group.detail, item.count].filter((x) => x !== undefined && x !== "").join(" · ") }}
                  </span>
                </slot>
              </span>
            </td>
            <template v-else>
              <td
                v-for="c in visible"
                :key="c.id"
                :data-align="c.align"
                :data-focus="c.focus || undefined"
                :data-wrap="c.wrap || (narrow && c.wrapNarrow) || undefined"
                :data-stuck="stuckIds.has(c.id) || undefined"
                :data-last-stuck="lastStuck === c.id || undefined"
                :style="cellStyle(c)"
              >
                <slot :name="`cell-${c.id}`" :row="item.row" :value="valueOf(c, item.row)">{{ valueOf(c, item.row) ?? "" }}</slot>
              </td>
            </template>
          </tr>
        </TransitionGroup>
        <tbody v-if="shownRows.length === 0">
          <tr>
            <td :colspan="visible.length" class="tx-dt__empty">
              <slot name="empty" :clear="clearFilters">
                {{ emptyText }}
                <TxButton v-if="activeFilters.length" variant="subtle" size="xs" @click="clearFilters">Quitar filtros</TxButton>
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="columns.some((c) => $slots[`foot-${c.id}`])">
          <tr>
            <td
              v-for="c in visible"
              :key="c.id"
              :data-align="c.align"
              :data-focus="c.focus || undefined"
              :data-stuck="stuckIds.has(c.id) || undefined"
              :data-last-stuck="lastStuck === c.id || undefined"
              :style="cellStyle(c)"
            >
              <slot :name="`foot-${c.id}`" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
