import {
  describeDate,
  formatDisplayDate,
  maskDateInput,
  parseDisplayDate,
  rangePresets,
} from "../src/utils/dates";

test("reads a date day first, never month first", () => {
  expect(parseDisplayDate("02/11/2026")).toBe("2026-11-02");
  expect(parseDisplayDate("2-11-26")).toBe("2026-11-02");
  expect(parseDisplayDate("31/02/2026")).toBeNull();
  expect(parseDisplayDate("2026-11-02")).toBeNull();
});

test("formats ISO as dd/mm/yyyy", () => {
  expect(formatDisplayDate("2025-06-30")).toBe("30/06/2025");
  expect(formatDisplayDate("")).toBe("");
});

test("puts the slashes in as digits are typed, and leaves typed separators alone", () => {
  expect(maskDateInput("3")).toBe("3");
  expect(maskDateInput("300")).toBe("30/0");
  expect(maskDateInput("30062025")).toBe("30/06/2025");
  expect(maskDateInput("300620251")).toBe("30/06/2025");
  expect(maskDateInput("30/062025")).toBe("30/06/2025");
  expect(maskDateInput("30/06/20")).toBe("30/06/20");
  expect(maskDateInput("2/11/26")).toBe("2/11/26");
  expect(maskDateInput("02-11-26")).toBe("02-11-26");
});

test("says the date in words", () => {
  expect(describeDate("2025-06-30")).toBe("lunes, 30 de junio de 2025");
  expect(describeDate("2025-06-30", "es-CO", true)).toBe("lun");
  expect(describeDate("nope")).toBe("");
});

test("named periods end by today, last ones close on their own end", () => {
  const p = Object.fromEntries(rangePresets("2026-02-15").map((x) => [x.key, x.range]));
  expect(p.thisMonth).toEqual({ start: "2026-02-01", end: "2026-02-15" });
  expect(p.lastMonth).toEqual({ start: "2026-01-01", end: "2026-01-31" });
  expect(p.lastQuarter).toEqual({ start: "2025-10-01", end: "2025-12-31" });
  expect(p.last7).toEqual({ start: "2026-02-09", end: "2026-02-15" });
  expect(rangePresets("2026-03-10").find((x) => x.key === "lastMonth")?.range.end).toBe("2026-02-28");
});
