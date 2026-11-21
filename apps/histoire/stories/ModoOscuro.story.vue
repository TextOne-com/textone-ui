<script setup lang="ts">
import { TxBadge, TxButton, TxSegmentedControl, TxTextInput, useTheme } from "@textone-com/vue";
import { computed } from "vue";

const { theme, setTheme } = useTheme();
const value = computed({ get: () => theme.value as string, set: (v: string) => setTheme(v as "system" | "light" | "dark") });
</script>

<template>
  <Story title="Dark mode" group="fundamentos">
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
        <p class="story-note">The Histoire sun/moon toggle also switches every story.</p>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Dark mode

The tokens **invert the ramps**: `--brand-50` becomes the darkest tint and `--brand-900` the
lightest ink; the cream becomes the night background. That way every role, and every component
that reads the tokens, adapts without rules of its own. The accent switches to a light lilac with
dark text on it: white on a mid purple does not reach 4.5:1.

**It is opt-in.** With no setting the tokens stay light, even if the device is in dark mode: that
way a page with no dark design (the public site, with its `bg-white`) is never half inverted. An
app turns it on by setting `data-theme` on `<html>`: `"dark"`, `"light"` or `"system"` (follows
the device). `applyStoredTheme()` does it with the saved choice, defaulting to `"system"`:

```ts
import { applyStoredTheme, useTheme } from "@textone-com/vue";

applyStoredTheme(); // in main.ts, before mounting: applies the theme (the system's by default)

const { theme, setTheme } = useTheme(); // "system" | "light" | "dark", remembered on the device
```

New roles for what must not be inverted blindly: `--inverse` / `--on-inverse` (toasts),
`--on-danger`, `--scrim` (dialog backdrop) and `--shadow-float`.

**Rule for new components:** no hard-coded `#fff` or `rgba(…)`; always a role.
</docs>
