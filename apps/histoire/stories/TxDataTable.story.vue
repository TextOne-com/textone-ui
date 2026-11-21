<script setup lang="ts">
import { type DataColumn, type Filters, type SortState, TxDataTable } from "@textone-com/vue";
import { ref } from "vue";

// Fictitious: no real distributors on a public page.
type Row = { id: number; name: string; code: string; city: string; sold: string; balance: string };
const rows: Row[] = [
  { id: 1, name: "Librería El Faro", code: "EC 01-01", city: "Bogotá", sold: "18250500.00", balance: "18250500.00" },
  { id: 2, name: "Colegio Los Pinos", code: "EC 01-02", city: "Bogotá", sold: "7876150.00", balance: "7949050.00" },
  { id: 3, name: "Papelería Central", code: "EC 01-03", city: "Bogotá", sold: "2660000.00", balance: "2660000.00" },
  { id: 4, name: "Distribuidora Andina", code: "EC 02-01", city: "Medellín", sold: "29128000.00", balance: "29128000.00" },
  { id: 5, name: "Colegio San Rafael", code: "EC 02-02", city: "Medellín", sold: "0.00", balance: "298500.00" },
  { id: 6, name: "Librería Letras", code: "EC 03-01", city: "Cali", sold: "9859000.00", balance: "10201000.00" },
];
const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const money = {
  align: "right" as const,
  width: 160,
  compare: (a: unknown, b: unknown) => Number(a) - Number(b),
  filter: "range" as const,
  parse: (t: string) => t.replace(/\./g, "").replace(",", ".") || null,
  format: (v: unknown) => pesos.format(Number(v)),
};
const columns: DataColumn<Row>[] = [
  { id: "name", header: "Cuenta", value: (r) => r.name, width: 240, pinned: true, hideable: false, filter: "text", wrapNarrow: true },
  { id: "code", header: "Código EC", value: (r) => r.code, width: 120, filter: "text" },
  { id: "city", header: "Ciudad", value: (r) => r.city, width: 130, filter: "options" },
  { id: "sold", header: "Vendido", value: (r) => r.sold, ...money },
  { id: "balance", header: "Saldo de cartera", value: (r) => r.balance, ...money, focus: true },
];
const sort = ref<SortState>({ id: "balance", desc: true });
const filters = ref<Filters>({});
</script>

<template>
  <Story title="TxDataTable" group="documento">
    <Variant title="Playground">
      <div class="story-pad">
        <TxDataTable
          v-model:sort="sort"
          v-model:filters="filters"
          :rows="rows"
          :columns="columns"
          :row-key="(r) => r.id"
          storage-key=""
          export-name="cuentas"
          label="Cuentas"
        >
          <template #toolbar="{ shown, total }">
            <span class="story-note">{{ shown }} de {{ total }} cuentas</span>
          </template>
          <template #cell-sold="{ value }">{{ pesos.format(Number(value)) }}</template>
          <template #cell-balance="{ value }">{{ pesos.format(Number(value)) }}</template>
          <template #foot-name>Total</template>
          <template #foot-balance>{{ pesos.format(68487050) }}</template>
        </TxDataTable>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDataTable

A table that **each person arranges for their own work**, and that remembers it.

- **Width:** drag a header's edge; with the edge focused, <kbd>←</kbd>
  <kbd>→</kbd> in 16 px steps; double-click restores the original width.
- **Pin:** from the column's ⋮ menu or from **Columnas** (Columns). Pinned columns stay on the
  left and cast a shadow when the rest scrolls underneath. **On a phone, pinned columns never take
  more than 45 %**; with `wrapNarrow` the text wraps to two lines instead of being cut.
- **Hide / show** columns and **density** (compact or comfortable) in **Columnas**;
  **Restablecer** (Reset) returns to the defaults.
- **Sort:** click the header — numbers largest first, words A→Z; a third click removes the sort.
  Empty values always go last.
- **Filter by column** (⋮ menu): `text` (contains, ignoring accents), `options` (checkboxes) or
  `range` (from–to). Active filters show as **chips** above the table, and as a dot in their
  header.
- **Export** the view (filters, sort and visible columns) to **CSV for Spanish-locale Excel**:
  `;`, decimal comma, accents intact.
- Rows slide when filtering or sorting (`tx-row`).

Width, pinned and hidden columns and density are saved per person under `storageKey`. Sort and
filters are `v-model:sort` and `v-model:filters`: the app decides whether they go in the URL.

```vue
<TxDataTable
  v-model:sort="orden"
  v-model:filters="filtros"
  :rows="cuentas"
  :columns="columnas"
  :row-key="(r) => r.account_id"
  storage-key="panel"
  export-name="panel"
>
  <template #toolbar="{ shown, total }">…</template>
  <template #cell-balance="{ row }"><Money :value="row.balance" /></template>
  <template #foot-balance><Money :value="totales.balance" /></template>
</TxDataTable>
```

**Column** (`DataColumn<Row>`): `id`, `header`, `value(row)` (for sorting, filtering and
exporting; money as decimal text), `align`, `width`, `minWidth`, `pinned`, `sortable`,
`compare(a, b)` (pass a decimal comparator for money), `filter`, `options`,
`parse(text)` (what was typed in a range → a comparable value), `format(value)` (how it reads in
chips and options), `hideable`, `focus` (lilac stripe), `wrapNarrow`, `exportValue(row)`.

**Slots:** `cell-<id>` (`{ row, value }`), `foot-<id>`, `toolbar` (`{ shown, total }`), `empty`.
</docs>
