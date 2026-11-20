/**
 * Dates as the business writes them: day first, `30/06/2025`, held as the ISO string
 * (`2025-06-30`). Text in, text out — no Date object, so no timezone moves the day.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const probe = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return (
    probe.getUTCFullYear() === Number(y) &&
    probe.getUTCMonth() === Number(m) - 1 &&
    probe.getUTCDate() === Number(d)
  );
}

/** `2025-06-30` → `30/06/2025`. An empty or malformed value reads as "". */
export function formatDisplayDate(iso: string): string {
  const match = ISO_DATE.exec(iso);
  if (!match) return "";
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

/**
 * What a person types, read day first: `2/11/2026`, `02-11-26`, `2.11.2026`. Null for anything
 * that is not a real day-first date.
 */
export function parseDisplayDate(text: string): string | null {
  const match = /^\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})\s*$/.exec(text);
  if (!match) return null;
  const [, d = "", m = "", y = ""] = match;
  const year = y.length === 2 ? `20${y}` : y;
  const iso = `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return isIsoDate(iso) ? iso : null;
}
