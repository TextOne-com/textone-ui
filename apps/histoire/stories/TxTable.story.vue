<script setup lang="ts">
import { TxTable } from "@textone-com/vue";
import { reactive } from "vue";

const state = reactive({ variant: "framed" as "plain" | "framed" | "paper", density: "compact" as "compact" | "default" });
const rows = [
  { name: "Librería Central", ec: "EC 01-01", sold: "$ 163.731.000", balance: "$ 171.325.500" },
  { name: "Distribuidora del Norte", ec: "EC 02-01", sold: "$ 72.650.000", balance: "$ 73.596.000" },
  { name: "Papelería La Esquina", ec: "EC 03-01", sold: "$ 36.916.700", balance: "$ 36.916.700" },
  { name: "Colegio San José", ec: "EC 04-01", sold: "$ 26.008.000", balance: "$ 26.008.000" },
];
</script>

<template>
  <Story title="TxTable" group="documento">
    <Variant title="Playground" :init-state="() => state">
      <div :class="state.variant === 'paper' ? 'paper-bg' : ''" style="padding: 24px">
        <TxTable :variant="state.variant" :density="state.density" label="Cuentas de la temporada">
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Código EC</th>
              <th class="tx-numeric">Vendido</th>
              <th class="tx-numeric">Saldo de cartera</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.ec">
              <td>{{ r.name }}</td>
              <td>{{ r.ec }}</td>
              <td class="tx-numeric">{{ r.sold }}</td>
              <td class="tx-numeric">{{ r.balance }}</td>
            </tr>
            <tr class="tx-totals">
              <td>Total</td>
              <td>4 cuentas</td>
              <td class="tx-numeric">$ 299.305.700</td>
              <td class="tx-numeric">$ 307.846.200</td>
            </tr>
          </tbody>
        </TxTable>
      </div>
      <template #controls>
        <HstButtonGroup v-model="state.variant" title="variant" :options="['plain', 'framed', 'paper']" />
        <HstButtonGroup v-model="state.density" title="density" :options="['compact', 'default']" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.paper-bg {
  background: var(--paper);
}
</style>

<docs lang="md">
# TxTable

Una tabla de cifras. Escribe `thead` / `tbody` / `tfoot` dentro como HTML normal.

```vue
<TxTable variant="framed" max-height="calc(100vh - 210px)" label="Cuentas">
  <thead><tr><th>Cuenta</th><th class="tx-numeric">Saldo</th></tr></thead>
  <tbody>
    <tr v-for="r in rows" :key="r.id"><td>{{ r.name }}</td><td class="tx-numeric">{{ r.saldo }}</td></tr>
    <tr class="tx-totals"><td>Total</td><td class="tx-numeric">{{ total }}</td></tr>
  </tbody>
</TxTable>
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `variant` | `plain \| framed \| paper` | `plain` | `framed`: marco, encabezado fijo y scroll; `paper`: sobre el documento |
| `density` | `compact \| default` | `compact` | Filas de 28 o 36 px |
| `maxHeight` | `string` | — | Alto del área con scroll |
| `label` | `string` | — | La convierte en región con nombre, enfocable para scroll con teclado |

## Clases

- **`tx-numeric`** en `th`/`td`: a la derecha, cifras tabulares, sin cortes.
- **`tx-totals`** en una fila: totales por peso y una regla — nunca una banda de color. En
  `framed`, queda fija abajo.

Los estilos base de las celdas no tienen especificidad (`:where`), así cualquier clase propia
(un CSS module, una utilidad) gana sin pelear.
</docs>
