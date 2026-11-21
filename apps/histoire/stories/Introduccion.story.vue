<template>
  <Story title="Introduction" group="top" docs-only />
</template>

<docs lang="md">
# Text One UI

Text One's design system: **one aesthetic** for the public site (`textone-web`, Astro) and the
internal tools (inventory and receivables, Vue). It comes from the **Brand Manual v2.1**:
institutional purple, cream, Fraunces and Plus Jakarta Sans — and no greys.

| Package | What it is |
|---|---|
| `@textone-com/tokens` | The brand as CSS variables (`tokens.css`) and as a Tailwind v4 theme (`tailwind.css`) |
| `@textone-com/vue` | Vue 3 components on Reka UI, with their own styles (`tx-`) that read the tokens |

## Install

The packages are private, on the **TextOne-com** organization's GitHub Packages. Once per
machine:

```bash
gh auth refresh -s read:packages
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

In the project:

```ini
# .npmrc
@textone-com:registry=https://npm.pkg.github.com
```

```bash
pnpm add @textone-com/tokens @textone-com/vue
```

## Use

```css
/* the app's stylesheet */
@import "tailwindcss";
@import "@textone-com/tokens/tailwind.css";
@import "@textone-com/vue/styles.css";
```

```ts
// vite.config.ts — a single copy of Vue for the app and the components
resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] }
```

```vue
<script setup lang="ts">
import { TxButton, TxTextInput } from "@textone-com/vue";
</script>
```

Load the fonts once (Plus Jakarta Sans 400–800 and Fraunces 600, for example with
`@fontsource`). In Astro, add `@astrojs/vue`: without `client:*` the components render to static
HTML, with no JavaScript.

## Principles

- **Components read roles, not colors.** `--ink`, `--surface`, `--accent`… Changing a role in the
  tokens changes every product.
- **Color means something**, and a state always carries a word (never a color alone).
- **Accessible by construction.** Reka provides real roles and keyboard behavior (combobox,
  listbox, tabs, dialog); every field links its label, description and error. All text passes
  WCAG AA.
- **Dates as text.** They are typed day first (`30/06/2025`) and stored as ISO; never a `Date`,
  so no time zone can move a document to another day.
- **No build.** The packages publish their source; each app's Vite compiles it.

## Release a version

```bash
corepack pnpm release:version 0.3.0
git commit -am "Release 0.3.0" && git tag v0.3.0 && git push --follow-tags
```
</docs>
