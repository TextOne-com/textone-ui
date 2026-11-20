<script setup lang="ts">
import { TxDocumentPaper, TxTable } from "@textone-com/vue";
</script>

<template>
  <Story title="TxDocumentPaper" group="documento">
    <Variant title="Una remisión registrada">
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

La superficie del **documento**: un documento registrado tal como el negocio lo imprimiría, sobre
el papel crema institucional (`--paper`). Es el único lugar de una herramienta interna donde
aparece la crema como superficie.

```vue
<TxDocumentPaper
  kind="Remisión"
  :number="`P.R. ${doc.number}`"
  :subtitle="companyName"
  :facts="[{ label: 'Fecha', value: formatDate(doc.date) }, { label: 'Cuenta' }]"
>
  <template #fact-Cuenta><RouterLink :to="…">{{ account.name }}</RouterLink></template>
  <TxTable variant="paper">…líneas…</TxTable>
  <template #footer>Precios congelados al registrar.</template>
</TxDocumentPaper>
```

| Prop / slot | | |
|---|---|---|
| `kind` | `string` | Etiqueta en mayúsculas (Remisión, Devolución) |
| `number` | `string` | Cómo se lee el papel: `P.R. 2229`. También slot `number` |
| `subtitle` | `string` | Línea bajo el número (la empresa). También slot `subtitle` |
| `facts` | `{ label; value? }[]` | Datos del encabezado; `fact-<label>` reemplaza un valor |
| slot por defecto | | El cuerpo: casi siempre un `TxTable variant="paper"` |
| slot `footer` | | Notas al pie |

Es un `<article>` con nombre accesible `"<kind> <number>"`.
</docs>
