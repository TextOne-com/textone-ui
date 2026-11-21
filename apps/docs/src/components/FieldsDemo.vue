<script setup lang="ts">
import { TxCheckbox, TxDateField, TxTextarea, TxTextInput } from "@textone-com/vue";
import { ref } from "vue";

const name = ref("");
const amount = ref("125.000,50");
const notes = ref("");
const date = ref("2025-06-30");
const done = ref(true);
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <TxTextInput v-model="name" label="Número del recibo de caja" placeholder="RC-0001" />
    <TxTextInput
      v-model="amount"
      label="Valor recibido"
      description="Como se escribe en Colombia: 1.250.000,50"
      align="right"
      figures
    >
      <template #left><span class="tx-figures">$</span></template>
    </TxTextInput>
    <TxTextInput model-value="1250000.50" label="Con error" error="Escriba el valor en pesos" />
    <TxDateField v-model="date" label="Fecha" min="2025-02-01" max="2025-11-30" />
    <TxTextarea v-model="notes" label="Motivo" placeholder="Por qué se pide" class="sm:col-span-2" />
    <TxCheckbox v-model="done" label="Incluir retirados" description="Muestra también los títulos que ya no se venden." />
  </div>
  <p class="m-0 w-full text-xs text-ink-secondary">
    Date stored as <code>{{ date || "—" }}</code> (ISO, no time zone).
  </p>
</template>
