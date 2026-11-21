import { readonly, ref } from "vue";

export type ThemeChoice = "system" | "light" | "dark";

const KEY = "tx-theme";
function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}
function apply(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
}

const current = ref<ThemeChoice>(typeof window === "undefined" ? "system" : read());
apply(current.value);

/**
 * Light, dark, or whatever the system says (the default). Sets data-theme on <html>, which the
 * tokens read, and remembers the choice on this device. Call `applyStoredTheme()` before the
 * app mounts to avoid a flash of the wrong theme.
 */
export function useTheme() {
  function setTheme(choice: ThemeChoice) {
    current.value = choice;
    apply(choice);
    try {
      if (choice === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, choice);
    } catch {
      // Storage blocked: the choice lasts for this page.
    }
  }
  return { theme: readonly(current), setTheme };
}

export function applyStoredTheme() {
  apply(read());
}
