import { HstVue } from "@histoire/plugin-vue";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "histoire";

/**
 * The design system's workshop: one story file per component, every variant on the brand's
 * own background, with controls to try props. Published to GitHub Pages under /textone-ui/,
 * hence the base path from HISTOIRE_BASE (set by the deploy workflow).
 */
export default defineConfig({
  plugins: [HstVue()],
  setupFile: "./setup.ts",
  storyMatch: ["stories/**/*.story.vue"],
  outDir: "dist",
  vite: {
    base: process.env.HISTOIRE_BASE ?? "/",
    plugins: [vue()],
    resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] },
    // The packages live two levels up (workspace links); stories read their files directly.
    server: { fs: { allow: ["../.."] } },
  },
  theme: {
    title: "Text One UI",
    favicon: "logo.svg",
    logo: {
      square: "./public/logo.svg",
      light: "./public/logo-horizontal.svg",
      dark: "./public/logo-horizontal.svg",
    },
    logoHref: "https://github.com/TextOne-com/textone-ui",
    colors: {
      // The brand ramp (@textone-com/tokens), so the workshop itself wears the brand.
      primary: {
        50: "#f4effa",
        100: "#e3d7f1",
        200: "#c8b3e4",
        300: "#876ba2",
        400: "#73519a",
        500: "#5e377e",
        600: "#502580",
        700: "#431581",
        800: "#371170",
        900: "#2c0e56",
      },
    },
    defaultColorScheme: "light",
    hideColorSchemeSwitch: false,
    storeColorScheme: false,
  },
  tree: {
    groups: [
      { id: "top", title: "" },
      { id: "fundamentos", title: "Foundations" },
      { id: "acciones", title: "Actions" },
      { id: "estados", title: "Feedback" },
      { id: "campos", title: "Inputs" },
      { id: "seleccion", title: "Selection" },
      { id: "estructura", title: "Layout" },
      { id: "documento", title: "Data display" },
    ],
  },
  backgroundPresets: [
    { label: "Canvas · cream-50", color: "#faf7ef" },
    { label: "Surface · blanco", color: "#ffffff" },
    { label: "Papel · cream-100", color: "#f1ead8" },
    { label: "Morado · brand-700", color: "#431581", contrastColor: "#ffffff" },
  ],
  defaultStoryProps: { layout: { type: "single", iframe: true } },
});
