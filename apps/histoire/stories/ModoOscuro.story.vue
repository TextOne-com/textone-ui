<script setup lang="ts">
import { TxBadge, TxButton, TxSegmentedControl, TxTextInput, useTheme } from "@textone-com/vue";
import { computed } from "vue";

const { theme, setTheme } = useTheme();
const value = computed({ get: () => theme.value as string, set: (v: string) => setTheme(v as "system" | "light" | "dark") });
</script>

<template>
  <Story title="Modo oscuro" group="fundamentos">
    <Variant title="useTheme">
      <div class="story-col">
        <TxSegmentedControl
          v-model="value"
          label="Tema"
          :options="[
            { value: 'system', label: 'Sistema' },
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' },
          ]"
        />
        <div style="display: flex; gap: 8px; align-items: center">
          <TxButton>Registrar</TxButton>
          <TxButton variant="default">Cancelar</TxButton>
          <TxBadge tone="success">Aprobada</TxBadge>
          <TxBadge tone="danger">Rechazada</TxBadge>
        </div>
        <TxTextInput label="Valor recibido" placeholder="$ 0" :width="240" />
        <p class="story-note">También el interruptor de sol/luna de Histoire cambia todas las historias.</p>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Modo oscuro

Los tokens **invierten las rampas**: `--brand-50` pasa a ser el tinte más oscuro y
`--brand-900` la tinta más clara; la crema se vuelve el fondo nocturno. Así cada rol y cada
componente que lee los tokens se adapta sin reglas propias. El acento cambia a un lila claro
con texto oscuro encima: blanco sobre un morado medio no llega a 4.5:1.

**Es opcional.** Sin indicación los tokens quedan en claro, aunque el dispositivo esté en oscuro:
así una página que no tiene diseño oscuro (la web pública, con sus `bg-white`) nunca se invierte
a medias. Una app lo activa poniendo `data-theme` en `<html>`: `"dark"`, `"light"` o `"system"`
(sigue al dispositivo). `applyStoredTheme()` lo hace con la elección guardada, y por defecto
`"system"`:

```ts
import { applyStoredTheme, useTheme } from "@textone-com/vue";

applyStoredTheme(); // en main.ts, antes de montar: activa el tema (por defecto, el del sistema)

const { theme, setTheme } = useTheme(); // "system" | "light" | "dark", recordado en el dispositivo
```

Roles nuevos para lo que no debe invertirse a ciegas: `--inverse` / `--on-inverse` (toasts),
`--on-danger`, `--scrim` (fondo de diálogos) y `--shadow-float`.

**Regla para componentes nuevos:** nada de `#fff` ni `rgba(…)` fijos; siempre un rol.
</docs>
