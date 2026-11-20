/** Lower case, accents folded: "magico" finds "Mágico". */
export function foldForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whether every word of the needle appears in the haystack, in any order. */
export function matchesAll(needle: string, fields: (string | null | undefined)[]): boolean {
  const words = foldForSearch(needle).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = foldForSearch(fields.filter(Boolean).join(" "));
  return words.every((w) => haystack.includes(w));
}
