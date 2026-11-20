<script setup lang="ts">
import { TxCombobox, TxSegmentedControl, TxSelect } from "@textone-com/vue";
import { ref } from "vue";

const seasons = [
  { value: "1", label: "2025 Calendario A · Abierta" },
  { value: "2", label: "2024 Calendario A · Cerrada" },
];
const titles = [
  { value: "TO-PRE-001", label: "TO-PRE-001 Mi Mundo Mágico Pre Escolar" },
  { value: "TO-PRI-001", label: "TO-PRI-001 Lenguaje Mágico 1" },
  { value: "TO-PRI-002", label: "TO-PRI-002 Lenguaje Mágico 2" },
  { value: "TO-PRI-003", label: "TO-PRI-003 Matemática Activa 1" },
  { value: "TPE-DIS-001", label: "TPE-DIS-001 Distribuciones TPE Ciencias 1" },
];
const season = ref<string | null>("1");
const actor = ref<string | null>(null);
const sku = ref<string | null>(null);
const added = ref<string[]>([]);
const view = ref("pendientes");
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <TxSelect v-model="season" label="Temporada" :options="seasons" />
    <TxSelect
      v-model="actor"
      label="Actuando como"
      placeholder="Elegir usuario"
      :options="[
        { value: '3', label: 'Auxiliar local' },
        { value: '4', label: 'Aprobador local · Aprobador' },
      ]"
      clearable
    />
    <TxCombobox v-model="sku" label="SKU" placeholder="Código o título" :options="titles" />
    <div>
      <TxCombobox
        label="Agregar título por código o nombre"
        placeholder="Escriba y elija…"
        :options="titles"
        picker
        @select="(v) => added.push(v)"
      />
      <p class="m-0 mt-1 text-xs text-ink-secondary">Agregados: {{ added.join(", ") || "ninguno" }}</p>
    </div>
    <TxSegmentedControl
      v-model="view"
      label="Ver"
      :options="[
        { value: 'pendientes', label: 'Pendientes' },
        { value: 'todas', label: 'Todas' },
      ]"
    />
  </div>
</template>
