<script setup lang="ts">
import { TxDocumentPaper, TxTable } from "@textone-com/vue";
</script>

<template>
  <Story title="TxDocumentPaper" group="documento">
    <Variant title="A recorded remisión">
      <div style="padding: 24px">
        <TxDocumentPaper
          kind="Remisión"
          number="P.R. 2229"
          subtitle="Text One.com"
          :facts="[
            { label: 'Fecha', value: '10/12/2025' },
            { label: 'Cuenta', value: 'Librería Central' },
            { label: 'Registrada por', value: 'Auxiliar local' },
          ]"
        >
          <TxTable variant="paper">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th class="tx-numeric">Cantidad</th>
                <th class="tx-numeric">Precio unitario</th>
                <th class="tx-numeric">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>TO-PRI-044</td><td>Viva el arte (3)</td><td class="tx-numeric">1</td><td class="tx-numeric">$ 22.000</td><td class="tx-numeric">$ 22.000</td></tr>
              <tr><td>TO-BAC-020</td><td>Viva el arte Novedad (7)</td><td class="tx-numeric">1</td><td class="tx-numeric">$ 22.000</td><td class="tx-numeric">$ 22.000</td></tr>
              <tr class="tx-totals"><td colspan="4">Valor del documento</td><td class="tx-numeric">$ 44.000</td></tr>
            </tbody>
          </TxTable>
          <template #footer>
            Precios congelados al registrar. Un documento registrado no se edita: se corrige con una
            devolución o una nota crédito.
          </template>
        </TxDocumentPaper>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# TxDocumentPaper

The **document** surface: a recorded document as the business would print it, on the
institutional cream paper (`--paper`). It is the only place in an internal tool where cream
appears as a surface.

```vue
<TxDocumentPaper
  kind="Remisión"
  :number="`P.R. ${doc.number}`"
  :subtitle="companyName"
  :facts="[{ label: 'Fecha', value: formatDate(doc.date) }, { label: 'Cuenta' }]"
>
  <template #fact-Cuenta><RouterLink :to="…">{{ account.name }}</RouterLink></template>
  <TxTable variant="paper">…lines…</TxTable>
  <template #footer>Precios congelados al registrar.</template>
</TxDocumentPaper>
```

| Prop / slot | | |
|---|---|---|
| `kind` | `string` | Uppercase label (Remisión, Devolución — delivery note, return) |
| `number` | `string` | How the paper reads: `P.R. 2229`. Also the `number` slot |
| `subtitle` | `string` | Line below the number (the company). Also the `subtitle` slot |
| `facts` | `{ label; value? }[]` | Header data; `fact-<label>` replaces a value |
| default slot | | The body: almost always a `TxTable variant="paper"` |
| `footer` slot | | Footnotes |

It is an `<article>` with the accessible name `"<kind> <number>"`.
</docs>
