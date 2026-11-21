import { foldForSearch } from "./search";

/** A cell's value, for sorting, filtering and export. Money stays a decimal string. */
export type CellValue = string | number | null | undefined;

export type DataColumn<Row> = {
  id: string;
  header: string;
  value: (row: Row) => CellValue;
  align?: "left" | "right";
  /** px. Defaults to 140. */
  width?: number;
  minWidth?: number;
  /** Pinned to the left when the person has not chosen otherwise. */
  pinned?: boolean;
  sortable?: boolean;
  /** Orders two present values (nulls always go last). Pass a decimal-string comparator for money. */
  compare?: (a: NonNullable<CellValue>, b: NonNullable<CellValue>) => number;
  filter?: "text" | "options" | "range";
  /** For `options`: the choices; by default every distinct value, labelled by `format`. */
  options?: { value: string; label: string }[];
  /** For `range`: the typed text as a comparable value ("1.000.000" → "1000000"); null if unreadable. */
  parse?: (text: string) => NonNullable<CellValue> | null;
  /** How a value reads in an options list or a filter chip. */
  format?: (value: NonNullable<CellValue>) => string;
  /** Can be hidden from the "Columnas" menu (default true). */
  hideable?: boolean;
  /** The column the table exists for: a tinted band. */
  focus?: boolean;
  /** Let the text wrap onto more lines (long notes), on every screen. */
  wrap?: boolean;
  /** On a phone, let the text wrap instead of cutting it with "…" (names with a code under). */
  wrapNarrow?: boolean;
  /** CSV text, when it should differ from `value` (e.g. a status code → its word). */
  exportValue?: (row: Row) => CellValue;
};

export type SortState = { id: string; desc: boolean } | null;
export type FilterValue =
  | { kind: "text"; text: string }
  | { kind: "options"; values: string[] }
  | { kind: "range"; min?: string; max?: string };
export type Filters = Record<string, FilterValue>;

export type TableLayout = {
  sizes: Record<string, number>;
  pinned: string[];
  hidden: string[];
  density: "compact" | "comfortable";
};

const defaultCompare = (a: NonNullable<CellValue>, b: NonNullable<CellValue>) =>
  typeof a === "number" && typeof b === "number"
    ? a - b
    : String(a).localeCompare(String(b), "es", { numeric: true });

const present = (v: CellValue): v is NonNullable<CellValue> => v !== null && v !== undefined && v !== "";

/** Sorted by a column; absent values after every present one, either direction. Stable. */
export function sortRows<Row>(rows: Row[], columns: DataColumn<Row>[], sort: SortState): Row[] {
  if (!sort) return rows;
  const column = columns.find((c) => c.id === sort.id);
  if (!column) return rows;
  const compare = column.compare ?? defaultCompare;
  const sign = sort.desc ? -1 : 1;
  return rows
    .map((row, index) => ({ row, index, v: column.value(row) }))
    .sort((a, b) => {
      const pa = present(a.v);
      const pb = present(b.v);
      if (!pa && !pb) return a.index - b.index;
      if (!pa) return 1;
      if (!pb) return -1;
      return sign * compare(a.v as NonNullable<CellValue>, b.v as NonNullable<CellValue>) || a.index - b.index;
    })
    .map((x) => x.row);
}

export function isActive(filter: FilterValue | undefined): boolean {
  if (!filter) return false;
  if (filter.kind === "text") return filter.text.trim() !== "";
  if (filter.kind === "options") return filter.values.length > 0;
  return Boolean(filter.min?.trim() || filter.max?.trim());
}

/** Rows that pass every active column filter. */
export function filterRows<Row>(rows: Row[], columns: DataColumn<Row>[], filters: Filters): Row[] {
  const active = columns.filter((c) => isActive(filters[c.id]));
  if (!active.length) return rows;
  return rows.filter((row) =>
    active.every((c) => {
      const f = filters[c.id] as FilterValue;
      const v = c.value(row);
      if (f.kind === "text") {
        const words = foldForSearch(f.text).split(" ").filter(Boolean);
        const hay = foldForSearch(String(v ?? ""));
        return words.every((w) => hay.includes(w));
      }
      if (f.kind === "options") return present(v) && f.values.includes(String(v));
      if (!present(v)) return false;
      const compare = c.compare ?? defaultCompare;
      const read = (t?: string) => {
        if (!t?.trim()) return null;
        return c.parse ? c.parse(t) : Number.isFinite(Number(t)) ? Number(t) : null;
      };
      const min = read(f.min);
      const max = read(f.max);
      if (min !== null && compare(v, min) < 0) return false;
      if (max !== null && compare(v, max) > 0) return false;
      return true;
    }),
  );
}

/** Pinned columns first (in their own order), then the rest; hidden ones left out. */
export function orderColumns<Row>(columns: DataColumn<Row>[], layout: TableLayout): DataColumn<Row>[] {
  const visible = columns.filter((c) => !layout.hidden.includes(c.id));
  return [
    ...visible.filter((c) => layout.pinned.includes(c.id)),
    ...visible.filter((c) => !layout.pinned.includes(c.id)),
  ];
}

export function defaultLayout<Row>(columns: DataColumn<Row>[]): TableLayout {
  return {
    sizes: Object.fromEntries(columns.map((c) => [c.id, c.width ?? 140])),
    pinned: columns.filter((c) => c.pinned).map((c) => c.id),
    hidden: [],
    density: "compact",
  };
}

/**
 * The view as CSV for Excel in Spanish: `;` between fields, decimal commas, a BOM so accents
 * survive, quotes where needed. Plain decimal strings only change their point to a comma — no
 * number is ever built from money.
 */
export function toCsv<Row>(rows: Row[], columns: DataColumn<Row>[]): string {
  const cell = (v: CellValue) => {
    if (!present(v)) return "";
    let text = String(v);
    if (/^-?\d+(\.\d+)?$/.test(text)) text = text.replace(".", ",");
    return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [
    columns.map((c) => cell(c.header)).join(";"),
    ...rows.map((r) => columns.map((c) => cell((c.exportValue ?? c.value)(r))).join(";")),
  ];
  return `﻿${lines.join("\r\n")}\r\n`;
}
