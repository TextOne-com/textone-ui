<template>
  <Story title="Typography" group="fundamentos" :layout="{ type: 'single', iframe: true }">
    <div class="story-col" style="max-width: 720px">
      <div>
        <p class="tx-eyebrow">H1 · Fraunces 600 · .tx-title--1</p>
        <h1 class="tx-title tx-title--1">Textos escolares que hacen crecer</h1>
      </div>
      <div>
        <p class="tx-eyebrow">H2 · Plus Jakarta Sans 700 · .tx-title--2</p>
        <h2 class="tx-title tx-title--2">Nuestras series</h2>
      </div>
      <div>
        <p class="tx-eyebrow">H3 · Plus Jakarta Sans 700 · .tx-title--3</p>
        <h3 class="tx-title tx-title--3">Devoluciones contra este documento</h3>
      </div>
      <div>
        <p class="tx-eyebrow">Body · Plus Jakarta Sans 400 · 14px</p>
        <p style="margin: 0">Soluciones educativas para instituciones, docentes y familias.</p>
      </div>
      <div>
        <p class="tx-eyebrow">Caption · Plus Jakarta Sans 700 · .tx-eyebrow</p>
        <p class="tx-eyebrow" style="margin: 0">Matemáticas · 1° grado</p>
      </div>
      <div>
        <p class="tx-eyebrow">Tabular figures · .tx-figures</p>
        <table style="border-collapse: collapse; font-size: 14px"><tbody>
          <tr><td>Vendido</td><td class="tx-figures" style="text-align: right; padding-left: 32px">$ 163.731.000</td></tr>
          <tr><td>Muestras</td><td class="tx-figures" style="text-align: right; padding-left: 32px">$ 7.594.500</td></tr>
          <tr><td><strong>Saldo</strong></td><td class="tx-figures" style="text-align: right; padding-left: 32px"><strong>$ 171.325.500</strong></td></tr>
        </tbody></table>
      </div>
    </div>
  </Story>
</template>

<docs lang="md">
# Typography

Brand manual, slide 13.

| Use | Font | Class |
|---|---|---|
| Page title, dialog title, brand moments | **Fraunces 600**, purple `brand-700` | `.tx-title .tx-title--1` |
| Section titles | **Plus Jakarta Sans 700** | `.tx-title .tx-title--2` / `--3` |
| Body and UI | **Plus Jakarta Sans 400–600**, 14px | (default, `--font-ui`) |
| Uppercase labels | **Plus Jakarta Sans 700**, 11px, tracking 0.12em | `.tx-eyebrow` |

## Figures

Plus Jakarta Sans ships **tabular figures** (`tnum`): with `.tx-figures` (or `tabular-nums` in
Tailwind) every digit takes the same width and columns of pesos line up. Use it for money,
quantities and document numbers.

## Loading the fonts

```ts
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css"; // the lockup's wordmark
import "@fontsource/fraunces/600.css";
```

Variables: `--font-display` (Fraunces), `--font-title` and `--font-ui` (Jakarta). In Tailwind:
`font-display`, `font-title`, `font-ui`.
</docs>
