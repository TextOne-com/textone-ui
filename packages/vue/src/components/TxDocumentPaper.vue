<script setup lang="ts">
/**
 * The documento surface — the one place cream appears: a recorded document as the business
 * would print it. `number` is how the paper reads (`I.D. 2600`); `facts` the header lines beside
 * it. A fact's value can be replaced through the `fact-<label>` slot. Set a table on it with
 * `<TxTable variant="paper">`.
 */
defineProps<{
  kind: string;
  number: string;
  /** A line under the number — the company, since both number their own series. */
  subtitle?: string;
  facts: { label: string; value?: string }[];
}>();
</script>

<template>
  <article class="tx-paper" :aria-label="`${kind} ${number}`">
    <header class="tx-paper__head">
      <div>
        <div class="tx-paper__kind">{{ kind }}</div>
        <div class="tx-paper__number tx-figures"><slot name="number">{{ number }}</slot></div>
        <div v-if="subtitle || $slots.subtitle" class="tx-paper__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </div>
      </div>
      <dl class="tx-paper__facts">
        <div v-for="fact in facts" :key="fact.label" class="tx-paper__fact">
          <dt>{{ fact.label }}</dt>
          <dd>
            <slot :name="`fact-${fact.label}`">{{ fact.value }}</slot>
          </dd>
        </div>
      </dl>
    </header>
    <div class="tx-paper__body"><slot /></div>
    <footer v-if="$slots.footer" class="tx-paper__footer"><slot name="footer" /></footer>
  </article>
</template>
