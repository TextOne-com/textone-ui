import type { Component } from "vue";

export type Size = "xs" | "sm" | "md";
export type Tone = "neutral" | "brand" | "info" | "success" | "warning" | "danger";
export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
  /** Extra words the search matches but does not show (codes, synonyms). */
  keywords?: string;
  /** A second, quieter line under the label. */
  description?: string;
  /** Options with the same group are listed together under it, in first-seen order. */
  group?: string;
};

/** One thing TxCommandPalette can open. */
export type CommandItem = {
  id: string;
  label: string;
  /** Heading it is listed under ("Ir a", "Cuentas", "Documentos"). */
  group: string;
  description?: string;
  /** A Tabler icon component. */
  icon?: Component;
  keywords?: string;
  /** Shown at the right: "G P". */
  hint?: string;
};
