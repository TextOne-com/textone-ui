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

/**
 * Slashes as you type: digits alone become `dd/mm/aaaa` progressively (`3006` → `30/06`), so a
 * date can be keyed on a number pad without reaching for `/`. Text that already has its own
 * separators is left as typed — `2/11/26` still reads.
 */
export function maskDateInput(text: string): string {
  // Ours: digits with slashes only where this mask puts them (after the day and the month).
  const ours = /^[\d/]*$/.test(text) && [...text].every((c, i) => c !== "/" || i === 2 || i === 5);
  if (!ours) return text;
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** `2025-06-30` → "lunes, 30 de junio de 2025" — what the field understood, in words. */
export function describeDate(iso: string, locale = "es-CO", short = false): string {
  if (!isIsoDate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1));
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    ...(short
      ? { weekday: "short" }
      : { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  })
    .format(date)
    .replace(".", "");
}

export type DateRange = { start: string; end: string };

function shift(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, (d ?? 1) + days));
  return date.toISOString().slice(0, 10);
}
function monthStart(y: number, m: number): string {
  const date = new Date(Date.UTC(y, m - 1, 1));
  return date.toISOString().slice(0, 10);
}
function monthEnd(y: number, m: number): string {
  return shift(monthStart(y, m + 1), -1);
}

/**
 * The periods people name rather than pick: this month, last month, this quarter, … — each
 * from `today` (ISO), ending no later than today. Pure: give it the business's today.
 */
export function rangePresets(today: string): { key: string; label: string; range: DateRange }[] {
  const [y = 0, m = 1] = today.split("-").map(Number);
  const q = Math.floor((m - 1) / 3);
  const lastQ = q === 0 ? { y: y - 1, q: 3 } : { y, q: q - 1 };
  return [
    { key: "last7", label: "Últimos 7 días", range: { start: shift(today, -6), end: today } },
    { key: "last30", label: "Últimos 30 días", range: { start: shift(today, -29), end: today } },
    { key: "thisMonth", label: "Este mes", range: { start: monthStart(y, m), end: today } },
    {
      key: "lastMonth",
      label: "Mes anterior",
      range: { start: monthStart(y, m - 1), end: monthEnd(y, m - 1) },
    },
    { key: "thisQuarter", label: "Este trimestre", range: { start: monthStart(y, q * 3 + 1), end: today } },
    {
      key: "lastQuarter",
      label: "Trimestre anterior",
      range: { start: monthStart(lastQ.y, lastQ.q * 3 + 1), end: monthEnd(lastQ.y, lastQ.q * 3 + 3) },
    },
    { key: "thisYear", label: "Este año", range: { start: `${y}-01-01`, end: today } },
  ];
}

/** Today on this device, as ISO. Apps with a business timezone pass their own `today`. */
export function localToday(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
