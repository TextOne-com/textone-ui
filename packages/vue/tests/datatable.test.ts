import { fireEvent, render, screen, within } from "@testing-library/vue";
import { h, ref } from "vue";
import TxDataTable from "../src/components/TxDataTable.vue";
import {
  type DataColumn,
  defaultLayout,
  filterRows,
  orderColumns,
  sortRows,
  toCsv,
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
