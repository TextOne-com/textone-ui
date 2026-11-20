import { formatDisplayDate, parseDisplayDate } from "../src/utils/dates";

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
