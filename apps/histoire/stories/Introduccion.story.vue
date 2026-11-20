<template>
  <Story title="Introduction" group="top" docs-only />
</template>

<docs lang="md">
# Text One UI

El sistema de diseño de Textone: **una sola estética** para el sitio público (`textone-web`,
Astro) y las herramientas internas (inventario y cartera, Vue). Sale del **Manual de Marca v2.1**:
morado institucional, crema, Fraunces y Plus Jakarta Sans — y nada de grises.

| Paquete | Qué es |
|---|---|
| `@textone-com/tokens` | La marca como variables CSS (`tokens.css`) y como tema de Tailwind v4 (`tailwind.css`) |
| `@textone-com/vue` | Componentes Vue 3 sobre Reka UI, con estilos propios (`tx-`) que leen los tokens |

## Instalar

Los paquetes son privados, en GitHub Packages de la organización **TextOne-com**. Una vez por
máquina:

```bash
gh auth refresh -s read:packages
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

En el proyecto:

```ini
# .npmrc
@textone-com:registry=https://npm.pkg.github.com
```

```bash
pnpm add @textone-com/tokens @textone-com/vue
```

## Usar

```css
/* hoja de estilos de la app */
@import "tailwindcss";
@import "@textone-com/tokens/tailwind.css";
@import "@textone-com/vue/styles.css";
```

```ts
// vite.config.ts — una sola copia de Vue para la app y los componentes
resolve: { dedupe: ["vue", "reka-ui", "@internationalized/date"] }
```

```vue
<script setup lang="ts">
import { TxButton, TxTextInput } from "@textone-com/vue";
</script>
```

Carga las fuentes una vez (Plus Jakarta Sans 400–800 y Fraunces 600, por ejemplo con
`@fontsource`). En Astro, agrega `@astrojs/vue`: sin `client:*` los componentes se vuelven HTML
estático, sin JavaScript.

## Principios

- **Los componentes leen roles, no colores.** `--ink`, `--surface`, `--accent`… Cambiar un rol en
  los tokens cambia todos los productos.
- **El color significa algo**, y un estado siempre lleva una palabra (nunca solo un color).
- **Accesibles por construcción.** Reka da roles y teclado reales (combobox, listbox, pestañas,
  diálogo); cada campo enlaza su etiqueta, descripción y error. Todo texto pasa WCAG AA.
- **Fechas como texto.** Se escriben día primero (`30/06/2025`) y se guardan en ISO; nunca un
  `Date`, así ninguna zona horaria mueve un documento de día.
- **Sin build.** Los paquetes publican el código fuente; el Vite de cada app lo compila.

## Publicar una versión

```bash
corepack pnpm release:version 0.3.0
git commit -am "Release 0.3.0" && git tag v0.3.0 && git push --follow-tags
```
</docs>
