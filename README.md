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

**Foundations and actions:** `TxBrandLockup` · `TxButton` · `TxIconButton` · `TxBadge` · `TxAlert` ·
`TxAvatar`.

**Inputs:** `TxField` · `TxTextInput` (clearable, counter) · `TxTextarea` · `TxSelect` (groups,
descriptions) · `TxCombobox` · `TxMultiSelect` · `TxDateField` (typed first: mask, weekday,
month/year view, named dates) · `TxDateRangeField` (named periods) · `TxCheckbox` ·
`TxSegmentedControl`.

**Structure:** `TxAppShell` (with a phone bottom bar) · `TxSidebar` / `TxSidebarGroup` /
`TxSidebarItem` · `TxBottomNav` / `TxBottomNavItem` · `TxPageHeader` · `TxTabs` · `TxDialog` ·
`TxSheet` · `TxPopover` · `TxCommandPalette` (⌘K).

**Data and feedback:** `TxTable` (plain / framed / paper) · `TxDataTable` (resize, pin, hide,
density, column filters, CSV for Excel, groups — remembered per person) · `TxDocumentPaper` ·
`TxSkeleton` · `TxToaster` with `toast()`.

**Utilities:** `parseDisplayDate`, `formatDisplayDate`, `maskDateInput`, `describeDate`,
`rangePresets`, `matchesAll`, `useTheme` / `applyStoredTheme`, `sortRows` / `filterRows` /
`toCsv`.

**Motion:** `tx-row` (table rows that glide on filter and sort), plus the small `tx-fade`,
`tx-pop`, `tx-chip` transitions. Everything stops under *reduce motion*.

**Themes:** light by default. A dark theme flips the ladders; it is **opt-in** — a page gets it
only with `data-theme="dark"` or `data-theme="system"` on `<html>` (`applyStoredTheme()` sets the
remembered choice, by default `"system"`). A consumer that sets neither stays light whatever the
device says.

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
"@textone-com/tokens": "^0.3.1",
"@textone-com/vue": "^0.3.1"
```

```css
/* the app's stylesheet */
@import "tailwindcss";
@import "@textone-com/tokens/tailwind.css";
@import "@textone-com/vue/styles.css"; /* only where the components are used */
```

```ts
// vite.config.ts of a Vue app: one copy of Vue for the app and the components, and the package
// served as source — never pre-bundled, or module state (toast()'s list) can split in two
resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] },
optimizeDeps: { exclude: ["@textone-com/vue"] },
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
corepack pnpm test        # vitest: 78 behaviour tests (fields, dates, tables, sidebar, overlays)
corepack pnpm --filter @textone-com/histoire visual         # visual regression (needs Docker)
corepack pnpm --filter @textone-com/histoire visual:update  # accept an intended change
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

**Visual regression.** Every variant, light and dark, is photographed by Linux Chromium (the
Playwright image) and compared with the references in `apps/histoire/visual/__screenshots__`.
Locally the browser runs in Docker and the tests on your machine, so the pixels match CI, which
runs the same image on every push. A change that moves a component shows up as a diff; when it
is meant, accept it with `visual:update` and commit the new references.

Histoire 1.0 (beta) needs Vite 7, so `apps/histoire` pins its own Vite while the rest of the
workspace runs Vite 8. Every push to `main` rebuilds and deploys it to GitHub Pages
(`.github/workflows/pages.yml`). Stories use made-up names and figures only: the site is public.

## Versions

| Version | What came |
|---|---|
| 0.1.0 (2026-11-20) | Tokens, the first Vue components, the Astro reference page |
| 0.2.0 (2026-11-20) | One design with the public site, from the brand manual: Fraunces + Plus Jakarta Sans, purple and cream, no greys |
| 0.3.0 (2026-11-21) | The staff app's kit: sidebar and phone navigation, sheets and popovers, typed dates and periods, multi-select, data tables people shape, skeletons, toasts, command palette, dark theme, depth tokens; 78 tests and visual regression in CI |
| 0.3.1 (2026-11-21) | The dark theme is opt-in: 0.3.0 followed the device everywhere and turned the light-only public site half dark |

## Next

- `TxDataTable` virtualisation when a table passes a few thousand rows (the catalog has 325).
- Story-level accessibility checks (axe) beside the visual ones.
