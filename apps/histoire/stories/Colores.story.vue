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
  { title: "Marca — morado institucional (manual, diapositiva 11)", tokens: group("brand-") },
  { title: "Crema — papel institucional (manual, diapositiva 12)", tokens: group("cream-") },
  {
    title: "Semánticos — -700 sobre su -50 o sobre blanco",
    tokens: ["success", "warning", "danger", "info"].flatMap((p) => group(`${p}-`)),
  },
  {
    title: "Roles — lo que leen los componentes",
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
  <Story title="Colors" group="fundamentos" :layout="{ type: 'single', iframe: false }">
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
# Colores

**No hay grises.** Los neutros salen de la propia rampa morada y de la crema, para que una pantalla
interna y una página pública se lean como la misma marca.

## Usa los roles, no la rampa

Los componentes leen **roles** (`--ink`, `--surface`, `--accent`…), no `--brand-700`. Escribe lo
mismo en tus pantallas: si mañana el acento cambia, cambia en todos lados.

| Rol | Valor | Para qué |
|---|---|---|
| `--canvas` | `cream-50` | Fondo de la página |
| `--surface` | blanco | Tablas, campos, paneles |
| `--surface-sunken` | `brand-50` | Encabezados de tabla, pie de formularios |
| `--ink` | `brand-900` | Texto (13,4:1 o más sobre toda superficie) |
| `--ink-secondary` | `brand-500` | Texto secundario (7,5:1 o más) |
| `--ink-placeholder` | `brand-300` | Placeholder — **solo sobre blanco** (4,51:1) |
| `--control-border` | `brand-300` | Borde de campos (un control necesita 3:1) |
| `--rule` / `--rule-strong` | `brand-100` / `brand-200` | Divisores, nunca texto |
| `--accent` | `brand-700` | Botón principal, foco, enlaces, ítem activo |
| `--paper` | `cream-100` | La superficie del documento impreso |

## Reglas del manual

- `brand-300` no va como texto normal sobre fondos que no sean blanco puro (baja de AA).
- Combinaciones aprobadas: morado sobre blanco, morado sobre crema, blanco sobre morado.
- El color significa estado — y **un estado siempre lleva una palabra**.

En Tailwind: `bg-canvas`, `text-ink-secondary`, `border-rule`, `bg-brand-700`, `text-cream-100`…
</docs>
