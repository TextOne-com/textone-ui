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
  // "system" is set too: the tokens are light unless the page opts in (data-theme).
  document.documentElement.dataset.theme = choice;
}

// Read, not applied: importing the package must not change a page's theme (the public site
// imports it for islands and has no dark design). applyStoredTheme() or setTheme() opt in.
const current = ref<ThemeChoice>(typeof window === "undefined" ? "system" : read());

/**
 * Light, dark, or whatever the system says (the default). Sets data-theme on <html> — "light",
 * "dark" or "system" — which the tokens read, and remembers the choice on this device. Call
 * `applyStoredTheme()` before the app mounts: it opts the page in (without it the tokens stay
 * light, which is what a page with no dark design needs) and avoids a flash of the wrong theme.
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
