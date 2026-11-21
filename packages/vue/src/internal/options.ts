import type { Option } from "./types";

/** Options in groups, in the order each group first appears; ungrouped ones first. */
export function groupOptions(options: Option[]): { label: string | null; options: Option[] }[] {
  const groups = new Map<string | null, Option[]>();
  for (const option of options) {
    const key = option.group ?? null;
    const list = groups.get(key);
    if (list) list.push(option);
    else groups.set(key, [option]);
  }
  const ungrouped = groups.get(null);
  const out: { label: string | null; options: Option[] }[] = ungrouped
    ? [{ label: null, options: ungrouped }]
    : [];
  for (const [label, list] of groups) if (label !== null) out.push({ label, options: list });
  return out;
}
