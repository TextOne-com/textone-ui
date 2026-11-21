import { fireEvent, render, screen, waitFor, within } from "@testing-library/vue";
import { h, ref } from "vue";
import TxDataTable from "../src/components/TxDataTable.vue";
import {
  type DataColumn,
  defaultLayout,
  filterRows,
  orderColumns,
  readViews,
  snapshotView,
  sortRows,
  toCsv,
  upsertView,
  viewMatches,
} from "../src/utils/dataTable";

type Row = { id: number; name: string; amount: string; status: string; goal: string | null };
const rows: Row[] = [
  { id: 1, name: "Librería El Faro", amount: "1500.00", status: "ACTIVE", goal: "0.8" },
  { id: 2, name: "Colegio Los Pinos", amount: "-20.50", status: "CLOSED", goal: null },
  { id: 3, name: "Papelería Central", amount: "300.00", status: "ACTIVE", goal: "1.2" },
];
// A decimal-string comparator, as the apps pass for money (never a float in the app).
const dec = (a: unknown, b: unknown) => Number(a) - Number(b);
const columns: DataColumn<Row>[] = [
  { id: "name", header: "Cuenta", value: (r) => r.name, filter: "text", pinned: true },
  { id: "status", header: "Estado", value: (r) => r.status, filter: "options" },
  { id: "amount", header: "Saldo", value: (r) => r.amount, align: "right", compare: dec, filter: "range" },
  { id: "goal", header: "Cumplimiento", value: (r) => r.goal, align: "right", compare: dec },
];

test("sorting keeps absent values last in both directions", () => {
  const asc = sortRows(rows, columns, { id: "goal", desc: false }).map((r) => r.id);
  const desc = sortRows(rows, columns, { id: "goal", desc: true }).map((r) => r.id);
  expect(asc).toEqual([1, 3, 2]);
  expect(desc).toEqual([3, 1, 2]);
});

test("column filters: text folds accents, options match, ranges are inclusive", () => {
  expect(filterRows(rows, columns, { name: { kind: "text", text: "libreria" } }).map((r) => r.id)).toEqual([1]);
  expect(filterRows(rows, columns, { status: { kind: "options", values: ["CLOSED"] } }).map((r) => r.id)).toEqual([2]);
  expect(filterRows(rows, columns, { amount: { kind: "range", min: "300" } }).map((r) => r.id)).toEqual([1, 3]);
  expect(filterRows(rows, columns, { amount: { kind: "range", max: "0" } }).map((r) => r.id)).toEqual([2]);
});

test("pinned columns come first and hidden ones are left out", () => {
  const layout = { ...defaultLayout(columns), pinned: ["amount"], hidden: ["status"] };
  expect(orderColumns(columns, layout).map((c) => c.id)).toEqual(["amount", "name", "goal"]);
});

test("CSV is for Excel in Spanish: BOM, semicolons, decimal commas, quotes", () => {
  const csv = toCsv([{ ...rows[0], name: 'El "Faro"; Bogotá' } as Row], columns);
  expect(csv.startsWith("﻿Cuenta;Estado;Saldo;Cumplimiento\r\n")).toBe(true);
  expect(csv).toContain('"El ""Faro""; Bogotá";ACTIVE;1500,00;0,8');
});

function renderTable() {
  const sort = ref<{ id: string; desc: boolean } | null>(null);
  render({
    setup: () => () =>
      h(
        TxDataTable as never,
        {
          rows,
          columns,
          rowKey: (r: Row) => r.id,
          label: "Cuentas",
          sort: sort.value,
          "onUpdate:sort": (v: { id: string; desc: boolean } | null) => {
            sort.value = v;
          },
        },
        { toolbar: ({ shown, total }: { shown: number; total: number }) => h("span", `${shown} de ${total}`) },
      ),
  });
  return { sort };
}

test("a header sorts: figures high to low first, then low to high, then off", async () => {
  const { sort } = renderTable();
  const button = screen.getByRole("button", { name: "Saldo" });
  await fireEvent.click(button);
  expect(sort.value).toEqual({ id: "amount", desc: true });
  await fireEvent.click(button);
  expect(sort.value).toEqual({ id: "amount", desc: false });
  await fireEvent.click(button);
  expect(sort.value).toBeNull();
});

test("a column is resized from the keyboard on its edge", async () => {
  renderTable();
  const edge = screen.getByRole("separator", { name: "Ancho de Saldo" });
  expect(edge).toHaveAttribute("aria-valuenow", "140");
  await fireEvent.keyDown(edge, { key: "ArrowRight" });
  expect(edge).toHaveAttribute("aria-valuenow", "156");
  await fireEvent.dblClick(edge);
  expect(edge).toHaveAttribute("aria-valuenow", "140");
});

test("the toolbar slot hears how many rows are shown", () => {
  renderTable();
  expect(screen.getByText("3 de 3")).toBeInTheDocument();
  const table = screen.getByRole("region", { name: "Cuentas" });
  expect(within(table).getAllByRole("row")).toHaveLength(4);
});

test("grouped rows sit under their heading, in the order the groups first appear", () => {
  render(TxDataTable as never, {
    props: {
      rows,
      columns,
      rowKey: (r: Row) => r.id,
      label: "Por estado",
      groupBy: (r: Row) => ({ id: r.status, label: r.status === "ACTIVE" ? "Activas" : "Cerradas" }),
    } as never,
  });
  const table = screen.getByRole("region", { name: "Por estado" });
  const texts = within(table)
    .getAllByRole("row")
    .slice(1)
    .map((tr) => tr.querySelector("td")?.textContent?.replace(/\s+/g, " ").trim());
  expect(texts).toEqual(["Activas 2", "Librería El Faro", "Papelería Central", "Cerradas 1", "Colegio Los Pinos"]);
});

test("a view captures active filters, order and columns, and matches only that state", () => {
  const layout = { ...defaultLayout(columns), hidden: ["goal"] };
  const filters = { amount: { kind: "range" as const, min: "300" }, name: { kind: "text" as const, text: " " } };
  const view = snapshotView("Saldo alto", filters, { id: "amount", desc: true }, layout);
  expect(view.filters).toEqual({ amount: { kind: "range", min: "300" } });
  expect(viewMatches(view, filters, { id: "amount", desc: true }, layout)).toBe(true);
  expect(viewMatches(view, filters, null, layout)).toBe(false);
  expect(viewMatches(view, {}, { id: "amount", desc: true }, layout)).toBe(false);
  expect(viewMatches(view, filters, { id: "amount", desc: true }, defaultLayout(columns))).toBe(false);
});

test("stored views survive a removed column and junk; a name saves over its namesake", () => {
  const ids = new Set(["name", "amount"]);
  const raw = JSON.stringify([
    { name: "A", filters: { gone: { kind: "text", text: "x" } }, sort: { id: "gone", desc: true }, hidden: ["gone"], pinned: ["name"] },
    { name: "" },
    42,
  ]);
  expect(readViews(raw, ids)).toEqual([{ name: "A", filters: {}, sort: null, hidden: [], pinned: ["name"] }]);
  expect(readViews("not json", ids)).toEqual([]);
  const a = { name: "Saldo", filters: {}, sort: null, hidden: [], pinned: [] };
  const b = { ...a, name: "saldo", sort: { id: "amount", desc: true } };
  expect(upsertView([a], b)).toEqual([b]);
});

test("saving a view and applying it brings back its filters and order", async () => {
  localStorage.clear();
  const sort = ref<{ id: string; desc: boolean } | null>(null);
  const filters = ref({});
  render({
    setup: () => () =>
      h(TxDataTable as never, {
        rows,
        columns,
        rowKey: (r: Row) => r.id,
        viewsKey: "test",
        sort: sort.value,
        filters: filters.value,
        "onUpdate:sort": (v: typeof sort.value) => {
          sort.value = v;
        },
        "onUpdate:filters": (v: object) => {
          filters.value = v;
        },
      }),
  });
  sort.value = { id: "amount", desc: true };
  filters.value = { status: { kind: "options", values: ["ACTIVE"] } };
  await fireEvent.click(screen.getByRole("button", { name: "Vistas" }));
  await fireEvent.update(await screen.findByLabelText("Nombre de la vista"), "Activas");
  await fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
  expect(JSON.parse(localStorage.getItem("tx-table-views:test") ?? "[]")).toHaveLength(1);
  // The table now shows that view: its name is on the trigger, and listed in the panel.
  await waitFor(() => expect(screen.getAllByRole("button", { name: "Activas" })).toHaveLength(2));
  expect(screen.queryByRole("button", { name: "Vistas" })).toBeNull();

  sort.value = null;
  filters.value = {};
  await fireEvent.click(within(screen.getByRole("dialog", { name: "Vistas" })).getByRole("button", { name: "Activas" }));
  expect(sort.value).toEqual({ id: "amount", desc: true });
  expect(filters.value).toEqual({ status: { kind: "options", values: ["ACTIVE"] } });
});

test("on a narrow frame, a card slot turns rows into cards with a Filtros panel", async () => {
  const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 390 });
  try {
    render(TxDataTable as never, {
      props: { rows, columns, rowKey: (r: Row) => r.id, label: "Cuentas" } as never,
      slots: { card: '<template #card="{ row }"><strong>{{ row.name }}</strong></template>' },
      global: { stubs: { "transition-group": false } },
    });
    const list = await screen.findByRole("list", { name: "Cuentas" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByRole("button", { name: "Columnas" })).toBeNull();
    expect(screen.getByRole("button", { name: "Filtros" })).toBeInTheDocument();
  } finally {
    if (width) Object.defineProperty(HTMLElement.prototype, "clientWidth", width);
  }
});

test("without a card slot, a narrow frame keeps the table", () => {
  const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 390 });
  try {
    render(TxDataTable as never, { props: { rows, columns, rowKey: (r: Row) => r.id, label: "Cuentas" } as never });
    expect(screen.getByRole("table")).toBeInTheDocument();
  } finally {
    if (width) Object.defineProperty(HTMLElement.prototype, "clientWidth", width);
  }
});
