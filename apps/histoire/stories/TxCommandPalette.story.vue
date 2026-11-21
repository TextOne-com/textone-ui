<script setup lang="ts">
import { IconBooks, IconChecklist, IconLayoutDashboard, IconPackages, IconUser, IconUsers } from "@tabler/icons-vue";
import { type CommandItem, TxButton, TxCommandPalette } from "@textone-com/vue";
import { ref } from "vue";

const open = ref(false);
const chosen = ref("");
// Fictitious: no real distributors on a public page.
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
        <TxButton @click="open = true">Open (⌘K / Ctrl K)</TxButton>
        <p class="story-note">Chosen: <code>{{ chosen || "—" }}</code></p>
        <TxCommandPalette v-model:open="open" :items="items" recent-key="" @select="(i) => (chosen = i.label)" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxCommandPalette

**Go anywhere by typing.** <kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>K</kbd> opens it from any screen. It
filters your `items` by every word, ignoring accents (the description and `keywords` too); for
server results, listen to `search` and pass them in with `loading`.

- <kbd>↑</kbd> <kbd>↓</kbd> move, <kbd>Enter</kbd> chooses (`select`), <kbd>Esc</kbd> closes.
- With no text, **recent** items come first (remembered on the device).
- Grouped by `group`; while typing, at most `perGroup` per group.
- `hint` shows a shortcut on the right ("G P").

```vue
<TxCommandPalette v-model:open="abierta" v-model:query="q" :items="items" :loading="buscando" @select="ir" />
```

| Prop | Type | Default |
|---|---|---|
| `items` | `CommandItem[]` (`{ id, label, group, description?, icon?, keywords?, hint? }`) | |
| `open`, `query` | `v-model` | |
| `loading` | `boolean` | `false` |
| `placeholder`, `title`, `nothingFound`, `recentLabel` | `string` | in Spanish |
| `shortcut` | `boolean` | `true` |
| `recentKey` | `string` | `"tx-command-recent"`; `""` for no recents |
| `perGroup` | `number` | `6` |
</docs>
