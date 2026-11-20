# Text One UI

The design system shared by every Text One front end: the public site (`textone-web`, Astro)
and the staff tools (`textone_inventory/deployments/web_ui`, Vue 3). One set of tokens, one set
of components, one look.

| Package | What it is | Who uses it |
|---|---|---|
| [`@textone-com/tokens`](packages/tokens) | The brand as CSS custom properties (`tokens.css`) and as a Tailwind v4 theme (`tailwind.css`) | `textone-web`, the staff UI, this repo's docs |
| [`@textone-com/vue`](packages/vue) | Vue 3 components on [Reka UI](https://reka-ui.com), styled from the tokens with plain `tx-` CSS | the staff UI; any Astro page through `@astrojs/vue` |
| [`apps/histoire`](apps/histoire) | **The component workshop** — every component's variants, live controls and its documentation, published at **[textone-com.github.io/textone-ui](https://textone-com.github.io/textone-ui/)** | people building screens |
| [`apps/docs`](apps/docs) | A one-page brand reference rendered by Astro with Vue islands — proof the components work in Astro | the public site's authors |

## Why it is shaped this way

- **Tokens are plain CSS.** Any stack reads `var(--brand-700)`; Tailwind gets the same values as
  utilities (`bg-brand-700`, `text-ink-secondary`, `font-display`). Changing a colour here
  changes it everywhere.
- **Components are Vue, not Astro.** An `.astro` component cannot run inside a Vue app; a Vue
  component runs in both (statically, or as an island in Astro). Interactive tools need a real
  framework, so the shared layer is Vue.
- **Component CSS does not depend on the host's Tailwind.** `@textone-com/vue/styles.css` is plain CSS
  with `tx-` prefixed classes reading the tokens, so it works in a Tailwind app, an Astro page or
  neither — and no `@source` scanning of `node_modules` is needed.
- **Accessible by construction.** Reka gives real roles and keyboard behaviour (combobox,
  listbox, tabs, dialog); every field links its label, description and error. The staff UI's
  Playwright specs address controls by role and label, so this is tested end to end there.
- **Dates are text.** `TxDateField` reads what people type day first (`30/06/2025`), stores the
  ISO string, and never builds a `Date`, so no timezone moves a document a day.

## Components

`TxBrandLockup` · `TxButton` · `TxIconButton` · `TxBadge` · `TxAlert` · `TxField` · `TxTextInput` · `TxTextarea` ·
`TxSelect` · `TxCombobox` (with `picker` mode) · `TxDateField` · `TxCheckbox` ·
`TxSegmentedControl` · `TxTabs` · `TxDialog` · `TxTable` (plain / framed / paper) ·
`TxPageHeader` · `TxDocumentPaper` · `TxAppShell`, plus `parseDisplayDate`, `formatDisplayDate`
and `matchesAll`.

## Use it

The packages are private, on **GitHub Packages** under the org
[TextOne-com](https://github.com/TextOne-com). Once per machine, give npm a token that can read
them (a classic token with `read:packages`; `gh auth refresh -s read:packages` then
`gh auth token` prints one):

```bash
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

In the consumer:

```ini
# .npmrc
@textone-com:registry=https://npm.pkg.github.com
```

```jsonc
// package.json
"@textone-com/tokens": "^0.1.0",
"@textone-com/vue": "^0.1.0"
```

```css
/* the app's stylesheet */
@import "tailwindcss";
@import "@textone-com/tokens/tailwind.css";
@import "@textone-com/vue/styles.css"; /* only where the components are used */
```

```ts
// vite.config.ts of a Vue app: one copy of Vue for the app and the components
resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] }
```

While working on the design system and an app at once, point the app at the checkout instead
(`"@textone-com/vue": "link:../textone-ui/packages/vue"`): changes are live on save.

In Astro, add `@astrojs/vue` and use the components directly — without a `client:*` directive they
render to static HTML with no JavaScript.

## Work on it

Node ≥ 22, pnpm through corepack.

```bash
corepack pnpm install
corepack pnpm stories     # http://localhost:4340 — Histoire, the component workshop
corepack pnpm docs        # http://localhost:4330 — the Astro brand page
corepack pnpm typecheck   # vue-tsc over the components
corepack pnpm test        # vitest: dates, fields, buttons, radios
```

The packages ship source (`.vue`, `.ts`, `.css`); the consumer's Vite compiles them, so there is
no build step here.

## Release

Both packages always share one version.

```bash
corepack pnpm release:version 0.2.0      # sets it in packages/tokens and packages/vue
git commit -am "Release 0.2.0"
git tag v0.2.0 && git push --follow-tags  # .github/workflows/publish.yml publishes both
```

The workflow refuses a tag that does not match the packages' version, and runs the type check and
the tests before publishing. A published version cannot be replaced: fix forward with a new one.

## Histoire

Each component has a story in `apps/histoire/stories/<Component>.story.vue`: a **Playground**
variant with controls for its props, variants for its states, and a `<docs lang="md">` block —
when to use it, its props, slots, events and accessibility — shown in the **Docs** tab. A new
component is not done until its story is.

Histoire 1.0 (beta) needs Vite 7, so `apps/histoire` pins its own Vite while the rest of the
workspace runs Vite 8. Every push to `main` rebuilds and deploys it to GitHub Pages
(`.github/workflows/pages.yml`). Stories use made-up names and figures only: the site is public.

## Next

- Visual regression of `apps/docs` (Playwright screenshots) so a token change is reviewed as an
  image, not only as a diff.
