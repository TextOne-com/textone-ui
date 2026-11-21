<p align="center">
  <img src="apps/histoire/public/logo-sticker.svg" alt="Text One" width="120" />
</p>

<h1 align="center">Text One UI</h1>

<p align="center">
  The design system shared by every Text One front end — one set of tokens, one set of
  components, one look.
</p>

<p align="center">
  <a href="https://textone-com.github.io/textone-ui/"><img alt="Histoire: browse the components" src="https://img.shields.io/badge/%F0%9F%93%9A%20Histoire-browse%20the%20components-431581?style=for-the-badge" /></a>
</p>

<p align="center">
  <a href="https://github.com/TextOne-com/textone-ui/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/TextOne-com/textone-ui/actions/workflows/ci.yml/badge.svg" /></a>
  <img alt="version" src="https://img.shields.io/badge/version-0.4.0-5e377e" />
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3.5-42b883" />
  <img alt="Reka UI" src="https://img.shields.io/badge/Reka%20UI-2.11-2c0e56" />
  <img alt="tests" src="https://img.shields.io/badge/tests-78%20passing-1f6b4f" />
</p>

---

## 🔗 See it live

### 👉 **[textone-com.github.io/textone-ui](https://textone-com.github.io/textone-ui/)**

The component workshop: every component with its variants, live controls to try its props, and
its documentation in the **Docs** tab — in light and dark (the ☀️/🌙 switch in the corner). It is
rebuilt on every push to `main`.

## 📦 What's inside

| | Package | What it is | Who uses it |
|---|---|---|---|
| 🎨 | [`@textone-com/tokens`](packages/tokens) | The brand as CSS custom properties (`tokens.css`) and a Tailwind v4 theme (`tailwind.css`) | `textone-web`, the staff UI, this repo's docs |
| 🧩 | [`@textone-com/vue`](packages/vue) | Vue 3 components on [Reka UI](https://reka-ui.com), styled from the tokens with plain `tx-` CSS | the staff UI; any Astro page through `@astrojs/vue` |
| 📚 | [`apps/histoire`](apps/histoire) | The component workshop, published at **[textone-com.github.io/textone-ui](https://textone-com.github.io/textone-ui/)** | people building screens |
| 🪧 | [`apps/docs`](apps/docs) | A one-page brand reference in Astro with Vue islands — proof the components work in Astro | the public site's authors |

## ✨ Why it is shaped this way

- 🎨 **Tokens are plain CSS.** Any stack reads `var(--brand-700)`; Tailwind gets the same values
  as utilities (`bg-brand-700`, `text-ink-secondary`, `font-display`). Change a colour here and it
  changes everywhere.
- 🟢 **Components are Vue, not Astro.** An `.astro` component cannot run inside a Vue app; a Vue
  component runs in both (statically, or as an island in Astro).
- 🧼 **Component CSS does not depend on the host's Tailwind.** `@textone-com/vue/styles.css` is
  plain CSS with `tx-` classes reading the tokens: it works in a Tailwind app, an Astro page or
  neither.
- ♿ **Accessible by construction.** Reka gives real roles and keyboard behaviour; every field
  links its label, description and error. The staff UI's Playwright specs address controls by
  role and label.
- 📅 **Dates are text.** `TxDateField` reads what people type day first (`30/06/2025`), stores
  the ISO string and never builds a `Date`, so no timezone moves a document a day.
- 🎬 **Motion that explains.** Rows glide when a table is filtered, sheets slide, counts pulse —
  and everything stops under *reduce motion*.

## 🧩 Components

| | Group | Components |
|---|---|---|
| 🖌️ | **Foundations and actions** | `TxBrandLockup` · `TxButton` · `TxIconButton` · `TxBadge` · `TxAlert` · `TxAvatar` |
| ✍️ | **Inputs** | `TxField` · `TxTextInput` (clearable, counter) · `TxTextarea` · `TxSelect` (groups, descriptions) · `TxCombobox` · `TxMultiSelect` · `TxDateField` (mask, weekday, month/year view, named dates) · `TxDateRangeField` (named periods) · `TxCheckbox` · `TxSegmentedControl` |
| 🧭 | **Structure** | `TxAppShell` (with a phone bottom bar) · `TxSidebar` · `TxBottomNav` · `TxPageHeader` · `TxTabs` · `TxDialog` · `TxSheet` · `TxPopover` · `TxCommandPalette` (⌘K) |
| 📊 | **Data and feedback** | `TxTable` · `TxDataTable` (resize, pin, hide, density, column filters, CSV for Excel, groups — remembered per person; cards on a phone; saved views) · `TxDocumentPaper` · `TxSkeleton` · `TxToaster` + `toast()` |
| 🛠️ | **Utilities** | `parseDisplayDate` · `formatDisplayDate` · `maskDateInput` · `describeDate` · `rangePresets` · `matchesAll` · `useTheme` · `sortRows` · `filterRows` · `toCsv` |

🎬 **Motion:** `tx-row` (rows that glide on filter and sort), plus `tx-fade`, `tx-pop`,
`tx-chip`.

🌗 **Themes:** light by default. The dark theme flips the colour ladders and is **opt-in** — a page
gets it only with `data-theme="dark"` or `data-theme="system"` on `<html>`
(`applyStoredTheme()` sets the remembered choice, `"system"` by default). A consumer that sets
neither stays light whatever the device says.

## 🚀 Use it

**1. 🔑 Give npm a token** (once per machine). The packages are private, on GitHub Packages
under [TextOne-com](https://github.com/TextOne-com); a classic token with `read:packages` does it:

```bash
gh auth refresh -s read:packages
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

**2. 📥 Point the consumer at the registry and install**

```ini
# .npmrc
@textone-com:registry=https://npm.pkg.github.com
```

```jsonc
// package.json
"@textone-com/tokens": "^0.4.0",
"@textone-com/vue": "^0.4.0"
```

**3. 🎨 Import the styles**

```css
@import "tailwindcss";
@import "@textone-com/tokens/tailwind.css";
@import "@textone-com/vue/styles.css"; /* only where the components are used */
```

**4. ⚙️ Configure Vite** — one copy of Vue for the app and the components, and the package served
as source (never pre-bundled, or module state such as `toast()`'s list can split in two):

```ts
resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] },
optimizeDeps: { exclude: ["@textone-com/vue"] },
```

> 💡 **Working on the design system and an app at once?** Point the app at the checkout
> (`"@textone-com/vue": "link:../textone-ui/packages/vue"`): changes are live on save.
>
> 🪐 **In Astro**, add `@astrojs/vue` and use the components directly — without a `client:*`
> directive they render to static HTML with no JavaScript.

## 🛠️ Work on it

Node ≥ 22, pnpm through corepack.

```bash
corepack pnpm install
corepack pnpm stories     # 📚 http://localhost:4340 — Histoire, the component workshop
corepack pnpm docs        # 🪧 http://localhost:4330 — the Astro brand page
corepack pnpm typecheck   # 🔍 vue-tsc over the components
corepack pnpm test        # 🧪 78 behaviour tests (fields, dates, tables, sidebar, overlays)
corepack pnpm --filter @textone-com/histoire visual         # 📸 visual regression (Docker)
corepack pnpm --filter @textone-com/histoire visual:update  # ✅ accept an intended change
```

The packages ship source (`.vue`, `.ts`, `.css`); the consumer's Vite compiles them, so there is
no build step here.

## 📚 Histoire and 📸 visual regression

Each component has a story in `apps/histoire/stories/<Component>.story.vue`: a **Playground** with
controls for its props, variants for its states, and a `<docs lang="md">` block — when to use it,
props, slots, events, accessibility. **A new component is not done until its story is.** Stories
use made-up names and figures only: the site is public.

Every variant, light and dark, is photographed by Linux Chromium (the Playwright image) and
compared with the references in `apps/histoire/visual/__screenshots__`. Locally the browser runs
in Docker so the pixels match CI, which runs the same image on every push. A change that moves a
component shows up as a diff; when it is meant, accept it with `visual:update` and commit the new
references.

Histoire 1.0 (beta) needs Vite 7, so `apps/histoire` pins its own Vite while the rest of the
workspace runs Vite 8.

## 🏷️ Release

Both packages always share one version.

```bash
corepack pnpm release:version 0.3.2          # sets it in packages/tokens and packages/vue
git commit -am "0.3.2: …"
git tag v0.3.2 && git push origin main v0.3.2  # .github/workflows/publish.yml publishes both
```

The workflow refuses a tag that does not match the packages' version and runs the type check and
the tests before publishing. A published version cannot be replaced: fix forward with a new one.

## 🗓️ Versions

| Version | Date | What came |
|---|---|---|
| 🌱 0.1.0 | 2026-11-20 | Tokens, the first Vue components, the Astro reference page |
| 🎨 0.2.0 | 2026-11-20 | One design with the public site, from the brand manual: Fraunces + Plus Jakarta Sans, purple and cream, no greys |
| 🚀 0.3.0 | 2026-11-21 | The staff app's kit: sidebar and phone navigation, sheets and popovers, typed dates and periods, multi-select, data tables people shape, skeletons, toasts, command palette, dark theme, depth tokens; 78 tests and visual regression in CI |
| 🩹 0.3.1 | 2026-11-21 | The dark theme is opt-in: 0.3.0 followed the device everywhere and turned the light-only public site half dark |
| ✨ 0.4.0 | 2026-11-21 | `TxDataTable`: a `card` slot shows one card per row below 640 px, with a "Filtros" panel for order and filters; saved views ("Vistas") under `viewsKey`; 83 tests |

## 🔭 Next

- ⚡ `TxDataTable` virtualisation when a table passes a few thousand rows (the catalog has 325).
- ♿ Story-level accessibility checks (axe) beside the visual ones.
