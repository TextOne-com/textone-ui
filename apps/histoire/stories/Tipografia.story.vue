<template>
  <Story title="Typography" group="fundamentos" :layout="{ type: 'single', iframe: false }">
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
        <p class="tx-eyebrow">Cuerpo · Plus Jakarta Sans 400 · 14px</p>
        <p style="margin: 0">Soluciones educativas para instituciones, docentes y familias.</p>
      </div>
      <div>
        <p class="tx-eyebrow">Caption · Plus Jakarta Sans 700 · .tx-eyebrow</p>
        <p class="tx-eyebrow" style="margin: 0">Matemáticas · 1° grado</p>
      </div>
      <div>
        <p class="tx-eyebrow">Cifras tabulares · .tx-figures</p>
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
# Tipografía

Manual de marca, diapositiva 13.

| Uso | Fuente | Clase |
|---|---|---|
| Título de página, título de diálogo, momentos de marca | **Fraunces 600**, morado `brand-700` | `.tx-title .tx-title--1` |
| Títulos de sección | **Plus Jakarta Sans 700** | `.tx-title .tx-title--2` / `--3` |
| Cuerpo y UI | **Plus Jakarta Sans 400–600**, 14px | (por defecto, `--font-ui`) |
| Etiquetas en mayúsculas | **Plus Jakarta Sans 700**, 11px, tracking 0,12em | `.tx-eyebrow` |

## Cifras

Plus Jakarta Sans trae **cifras tabulares** (`tnum`): con `.tx-figures` (o `tabular-nums` en
Tailwind) cada dígito ocupa el mismo ancho y las columnas de pesos se alinean. Úsalo en dinero,
cantidades y números de documento.

## Cargar las fuentes

```ts
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css"; // el wordmark del lockup
import "@fontsource/fraunces/600.css";
```

Variables: `--font-display` (Fraunces), `--font-title` y `--font-ui` (Jakarta). En Tailwind:
`font-display`, `font-title`, `font-ui`.
</docs>
