<script setup lang="ts">
import { TxButton, TxDialog, TxTabs, TxTextarea } from "@textone-com/vue";
import { ref } from "vue";

const tab = ref("resumen");
const open = ref(false);
const note = ref("");
</script>

<template>
  <div class="w-full">
    <TxTabs
      v-model="tab"
      label="Vistas de la cuenta"
      :tabs="[
        { value: 'resumen', label: 'Resumen' },
        { value: 'movimientos', label: 'Movimientos' },
        { value: 'matriz', label: 'Matriz' },
      ]"
    >
      <template #default="{ active }">
        <p class="m-0 text-[13px] text-ink-secondary">Active view: {{ active }}</p>
      </template>
    </TxTabs>
  </div>
  <TxButton @click="open = true">Aprobar…</TxButton>
  <TxDialog v-model:open="open" title="Aprobar nota crédito" description="El saldo baja cuando se aprueba.">
    <TxTextarea v-model="note" label="Nota" />
    <template #footer>
      <TxButton variant="default" @click="open = false">Cancelar</TxButton>
      <TxButton @click="open = false">Aprobar y registrar</TxButton>
    </template>
  </TxDialog>
</template>
