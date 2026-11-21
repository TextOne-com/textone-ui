import { defineConfig } from "@playwright/test";

/**
 * Visual regression: every story variant, light and dark, photographed from the built workshop
 * and compared with the committed references in visual/__screenshots__. A CSS change that moves
 * a component someone did not mean to touch fails here, with a diff to look at.
 *
 * References are rendered by Linux Chromium from the Playwright image, so fonts and
 * anti-aliasing match CI. Locally `corepack pnpm visual` (and `visual:update`) run the browser in
 * that image through Docker (PW_REMOTE) while the tests and the preview server stay on the host.
 */
const remote = process.env.PW_REMOTE;
export default defineConfig({
  testDir: "visual",
  outputDir: "visual/results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  // A rare slow start in a shared runner is not a visual change: one retry, CI only.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { outputFolder: "visual/report", open: "never" }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: remote ? "http://host.docker.internal:4341" : "http://localhost:4341",
    ...(remote ? { connectOptions: { wsEndpoint: remote } } : {}),
    viewport: { width: 1024, height: 720 },
    deviceScaleFactor: 1,
    locale: "es-CO",
    timezoneId: "America/Bogota",
    colorScheme: "light",
  },
  webServer: {
    command: "npx vite preview --outDir dist --port 4341 --strictPort --host",
    url: "http://localhost:4341/__sandbox.html",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
