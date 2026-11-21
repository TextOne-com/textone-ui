<script setup lang="ts">
import tokensCss from "@textone-com/tokens/tokens.css?raw";

type Token = { name: string; value: string; note?: string };

// Read from the package itself, so this page can never show a value the tokens do not have.
const tokens: Token[] = [
  ...tokensCss.split("@media")[0].matchAll(/--([a-z0-9-]+):\s*([^;]+);(?:[ \t]*\/\*[ \t]*(.*?)[ \t]*\*\/)?/g),
].map(([, name = "", value = "", note]) => ({ name, value: value.trim(), note }));

const group = (prefix: string) => tokens.filter((t) => t.name.startsWith(prefix));
const named = (names: string[]) => names.flatMap((n) => tokens.filter((t) => t.name === n));

const sections = [
  { title: "Brand — institutional purple (manual, slide 11)", tokens: group("brand-") },
  { title: "Cream — institutional paper (manual, slide 12)", tokens: group("cream-") },
  {
    title: "Semantic — -700 on its -50 or on white",
    tokens: ["success", "warning", "danger", "info"].flatMap((p) => group(`${p}-`)),
  },
  {
    title: "Roles — what the components read",
    tokens: named([
      "canvas",
      "surface",
      "surface-sunken",
      "hover",
      "ink",
      "ink-secondary",
      "ink-placeholder",
      "rule",
      "rule-strong",
      "control-border",
      "accent",
      "accent-hover",
      "accent-tint",
      "eyebrow",
      "paper",
      "paper-border",
    ]),
  },
];
</script>

<template>
  <Story title="Colors" group="fundamentos" :layout="{ type: 'single', iframe: true }">
    <div class="story-col" style="max-width: none">
      <section v-for="s in sections" :key="s.title">
        <h2 class="tx-title tx-title--3" style="margin-bottom: 12px">{{ s.title }}</h2>
        <ul class="swatches">
          <li v-for="t in s.tokens" :key="t.name">
            <div class="chip" :style="{ background: `var(--${t.name})` }" />
            <div class="meta">
              <code>--{{ t.name }}</code>
              <span>{{ t.value }}</span>
              <small v-if="t.note">{{ t.note }}</small>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </Story>
</template>

<style scoped>
.swatches {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
}
.swatches li {
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  background: var(--surface);
  overflow: hidden;
}
.chip {
  height: 56px;
  border-bottom: 1px solid var(--rule);
}
.meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  font-size: 12px;
}
.meta code {
  font-weight: 700;
  color: var(--ink);
}
.meta span {
  color: var(--ink-secondary);
}
.meta small {
  color: var(--ink-secondary);
  font-size: 11px;
}
</style>

<docs lang="md">
# Colors

**There are no greys.** The neutrals come from the purple ramp itself and from the cream, so an
internal screen and a public page read as the same brand.

## Use the roles, not the ramp

Components read **roles** (`--ink`, `--surface`, `--accent`…), not `--brand-700`. Write your
screens the same way: if the accent changes tomorrow, it changes everywhere.

| Role | Value | For |
|---|---|---|
| `--canvas` | `cream-50` | Page background |
| `--surface` | white | Tables, fields, panels |
| `--surface-sunken` | `brand-50` | Table headers, form footers |
| `--ink` | `brand-900` | Text (13.4:1 or more on every surface) |
| `--ink-secondary` | `brand-500` | Secondary text (7.5:1 or more) |
| `--ink-placeholder` | `brand-300` | Placeholder — **on white only** (4.51:1) |
| `--control-border` | `brand-300` | Field borders (a control needs 3:1) |
| `--rule` / `--rule-strong` | `brand-100` / `brand-200` | Dividers, never text |
| `--accent` | `brand-700` | Primary button, focus, links, active item |
| `--paper` | `cream-100` | The surface of the printed document |

## Rules from the brand manual

- `brand-300` is not used as body text on anything other than pure white (it falls below AA).
- Approved pairings: purple on white, purple on cream, white on purple.
- Color means state — and **a state always carries a word**.

In Tailwind: `bg-canvas`, `text-ink-secondary`, `border-rule`, `bg-brand-700`, `text-cream-100`…
</docs>
