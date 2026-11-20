<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "reka-ui";
import type { Option } from "../internal/types";

/**
 * Views of one thing, one at a time. The slot is the active view's panel: render what
 * `modelValue` names. Each tab is a real tab (role, aria-selected, arrow keys).
 */
defineProps<{ tabs: Option[]; label?: string }>();
const model = defineModel<string>({ required: true });
</script>

<template>
  <TabsRoot v-model="model" class="tx-tabs" :unmount-on-hide="true">
    <TabsList class="tx-tabs__list" :aria-label="label">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        class="tx-tabs__tab"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent :value="model" class="tx-tabs__panel">
      <slot :active="model" />
    </TabsContent>
  </TabsRoot>
</template>
