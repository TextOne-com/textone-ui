import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// The design system's living reference: every token and component, rendered by Astro with the
// Vue components as islands — the same way textone-web would use them.
export default defineConfig({
  integrations: [vue()],
  vite: { plugins: [tailwindcss()] },
});
