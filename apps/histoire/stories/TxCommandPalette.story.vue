<script setup lang="ts">
import { IconBooks, IconChecklist, IconLayoutDashboard, IconPackages, IconUser, IconUsers } from "@tabler/icons-vue";
import { type CommandItem, TxButton, TxCommandPalette } from "@textone-com/vue";
import { ref } from "vue";

const open = ref(false);
const chosen = ref("");
// Ficticios: nada de distribuidores reales en una página pública.
const items: CommandItem[] = [
  { id: "p", label: "Panel de control", group: "Ir a", icon: IconLayoutDashboard, hint: "G P" },
  { id: "c", label: "Cuentas", group: "Ir a", icon: IconUsers, hint: "G C" },
  { id: "a", label: "Aprobaciones", group: "Ir a", icon: IconChecklist, hint: "G A" },
  { id: "e", label: "Existencias", group: "Ir a", icon: IconPackages, hint: "G E" },
  { id: "t", label: "Catálogo", group: "Ir a", icon: IconBooks, hint: "G T" },
  { id: "1", label: "Librería El Faro", description: "EC 01-01", group: "Cuentas", icon: IconUser },
  { id: "2", label: "Colegio Los Pinos", description: "EC 01-02", group: "Cuentas", icon: IconUser },
  { id: "3", label: "Distribuidora Andina", description: "EC 02-01", group: "Cuentas", icon: IconUser },
];
</script>

<template>
  <Story title="TxCommandPalette" group="seleccion" :layout="{ type: 'single', iframe: true }">
    <Variant title="Playground">
      <div class="story-pad" style="min-height: 420px">
        <TxButton @click="open = true">Abrir (⌘K / Ctrl K)</TxButton>
        <p class="story-note">Elegido: <code>{{ chosen || "—" }}</code></p>
        <TxCommandPalette v-model:open="open" :items="items" recent-key="" @select="(i) => (chosen = i.label)" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCommandPalette

**Ir a cualquier parte escribiendo.** <kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>K</kbd> la abre desde
cualquier pantalla. Filtra tus `items` por cada palabra, sin tildes (también la descripción y
`keywords`); para resultados del servidor, escucha `search` y pásalos con `loading`.

- <kbd>↑</kbd> <kbd>↓</kbd> se mueven, <kbd>Enter</kbd> elige (`select`), <kbd>Esc</kbd> cierra.
- Sin texto, los **recientes** van primero (se recuerdan en el dispositivo).
- Agrupada por `group`; al escribir, a lo sumo `perGroup` por grupo.
- `hint` muestra un atajo a la derecha ("G P").

```vue
<TxCommandPalette v-model:open="abierta" v-model:query="q" :items="items" :loading="buscando" @select="ir" />
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `items` | `CommandItem[]` (`{ id, label, group, description?, icon?, keywords?, hint? }`) | |
| `open`, `query` | `v-model` | |
| `loading` | `boolean` | `false` |
| `placeholder`, `title`, `nothingFound`, `recentLabel` | `string` | en español |
| `shortcut` | `boolean` | `true` |
| `recentKey` | `string` | `"tx-command-recent"`; `""` sin recientes |
| `perGroup` | `number` | `6` |
</docs>
