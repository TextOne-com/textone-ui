import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

type Story = { id: string; title: string; variants: { id: string; title: string }[] };
const { stories } = JSON.parse(
  readFileSync(new URL("../dist/histoire.json", import.meta.url), "utf8"),
) as { stories: Story[] };

/** Pages that are documentation, or whose content is a live clock, are not photographed. */
const skip = new Set<string>(["stories-introduccion-story-vue"]);

for (const theme of ["light", "dark"] as const) {
  for (const story of stories) {
    if (skip.has(story.id)) continue;
    for (const variant of story.variants) {
      test(`${story.title} › ${variant.title} (${theme})`, async ({ page }) => {
        // The tokens read data-theme; set it before anything paints.
        await page.addInitScript((t) => {
          (window as { __TX_THEME__?: string }).__TX_THEME__ = t;
          document.documentElement.dataset.theme = t;
        }, theme);
        // "load", then the fonts: `networkidle` sometimes never settles with workers in parallel.
        await page.goto(`/__sandbox.html?storyId=${story.id}&variantId=${variant.id}`, {
          waitUntil: "load",
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(theme);
        await expect(page).toHaveScreenshot(`${story.id}--${variant.id}--${theme}.png`, {
          fullPage: true,
        });
      });
    }
  }
}
