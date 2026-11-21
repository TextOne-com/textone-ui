<script setup lang="ts">
import { type DataColumn, type Filters, type SortState, TxDataTable } from "@textone-com/vue";
import { ref } from "vue";

// Ficticios: nada de distribuidores reales en una página pública.
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

Una tabla que **cada persona acomoda a su trabajo**, y que lo recuerda.

- **Ancho:** arrastrar el borde de un encabezado; con el borde enfocado, <kbd>←</kbd>
  <kbd>→</kbd> de a 16 px; doble clic vuelve al ancho original.
- **Fijar:** desde el menú ⋮ de la columna o desde **Columnas**. Lo fijado queda a la izquierda y
  proyecta una sombra cuando el resto pasa por debajo. **En el teléfono lo fijado nunca ocupa más
  del 45 %**; con `wrapNarrow` el texto pasa a dos líneas en vez de cortarse.
- **Ocultar / mostrar** columnas y **densidad** (compacta o cómoda) en **Columnas**;
  **Restablecer** vuelve a lo de fábrica.
- **Ordenar:** clic en el encabezado — cifras de mayor a menor primero, palabras A→Z; un tercer
  clic quita el orden. Los vacíos van siempre al final.
- **Filtrar por columna** (menú ⋮): `text` (contiene, sin tildes), `options` (casillas) o `range`
  (desde–hasta). Los filtros activos quedan como **chips** sobre la tabla, y un punto en su
  encabezado.
- **Exportar** la vista (filtros, orden y columnas visibles) a **CSV para Excel en español**:
  `;`, coma decimal, tildes intactas.
- Las filas se deslizan al filtrar u ordenar (`tx-row`).

Ancho, columnas fijadas y ocultas y densidad se guardan por persona en `storageKey`. Orden y
filtros son `v-model:sort` y `v-model:filters`: la app decide si van en la URL.

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

**Columna** (`DataColumn<Row>`): `id`, `header`, `value(row)` (para ordenar, filtrar y
exportar; el dinero, como texto decimal), `align`, `width`, `minWidth`, `pinned`, `sortable`,
`compare(a, b)` (pásale un comparador de decimales para dinero), `filter`, `options`,
`parse(texto)` (lo escrito en un rango → valor comparable), `format(valor)` (cómo se lee en
chips y opciones), `hideable`, `focus` (franja lila), `wrapNarrow`, `exportValue(row)`.

**Slots:** `cell-<id>` (`{ row, value }`), `foot-<id>`, `toolbar` (`{ shown, total }`), `empty`.
</docs>
