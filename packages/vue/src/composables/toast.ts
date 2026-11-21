import { readonly, shallowReactive } from "vue";

export type ToastTone = "success" | "error" | "info";
export type ToastAction = { label: string; onClick?: () => void; href?: string };
export type Toast = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: ToastAction;
  /** ms; 0 keeps it until closed. Errors stay by default. */
  duration: number;
};

const list = shallowReactive<Toast[]>([]);
let next = 1;

/**
 * Tell the person something happened without moving them: "Recibo registrado", with an action
 * to go and see it. Shown by the one <TxToaster /> the app mounts. Returns the toast's id.
 */
export function toast(input: Omit<Toast, "id" | "duration" | "tone"> & { tone?: ToastTone; duration?: number }): number {
  const tone = input.tone ?? "success";
  const id = next++;
  list.push({ ...input, id, tone, duration: input.duration ?? (tone === "error" ? 0 : 5000) });
  // At most four on screen: the oldest goes.
  while (list.length > 4) list.shift();
  return id;
}

export function dismissToast(id: number) {
  const at = list.findIndex((t) => t.id === id);
  if (at >= 0) list.splice(at, 1);
}

export const toasts = readonly(list);
