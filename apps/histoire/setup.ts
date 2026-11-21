import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/fraunces/600.css";
import "@textone-com/tokens/tokens.css";
import "@textone-com/vue/styles.css";
import "./setup.css";

import { defineSetupVue3 } from "@histoire/plugin-vue";

export const setupVue3 = defineSetupVue3(() => {
  // Histoire's light/dark switch marks <html class="htw-dark">; the tokens read data-theme.
  // Mirror one into the other, so every story shows the component in the chosen theme.
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // The visual tests fix the theme themselves (visual/stories.spec.ts): leave it alone.
  const forced = (window as { __TX_THEME__?: string }).__TX_THEME__;
  if (forced) {
    root.dataset.theme = forced;
    return;
  }
  const sync = () => {
    root.dataset.theme = root.classList.contains("htw-dark") ? "dark" : "light";
  };
  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["class"] });
});
