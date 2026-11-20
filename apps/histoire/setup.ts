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
  // Nothing global to install: the components need no plugin, only the stylesheets above.
});
