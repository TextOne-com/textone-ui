<script setup lang="ts">
/**
 * A placeholder in the shape of what is loading, so the page does not jump when it arrives.
 * `table` draws a header and rows, `cards` a grid of blocks, `text` some lines, `block` one box.
 * A soft light sweeps across (none under reduced motion). Hidden from screen readers, which hear
 * `label` from a status region instead.
 */
withDefaults(
  defineProps<{
    variant?: "table" | "cards" | "text" | "block";
    rows?: number;
    columns?: number;
    cards?: number;
    lines?: number;
    width?: string;
    height?: string;
    label?: string;
  }>(),
  { variant: "table", rows: 8, columns: 5, cards: 4, lines: 3, label: "Cargando…" },
);
</script>

<template>
  <div class="tx-skeleton" :data-variant="variant" role="status" :aria-label="label">
    <template v-if="variant === 'table'">
      <div class="tx-skeleton__table" aria-hidden="true">
        <div class="tx-skeleton__row tx-skeleton__row--head">
          <span v-for="c in columns" :key="c" class="tx-skeleton__bone" :style="{ width: c === 1 ? '28%' : '12%' }" />
        </div>
        <div v-for="r in rows" :key="r" class="tx-skeleton__row" :style="{ '--tx-i': r }">
          <span
            v-for="c in columns"
            :key="c"
            class="tx-skeleton__bone"
            :style="{ width: c === 1 ? `${22 + ((r * 7) % 14)}%` : `${8 + ((r + c) % 5)}%` }"
          />
        </div>
      </div>
    </template>
    <div v-else-if="variant === 'cards'" class="tx-skeleton__cards" aria-hidden="true">
      <div v-for="c in cards" :key="c" class="tx-skeleton__card">
        <span class="tx-skeleton__bone" style="width: 45%" />
        <span class="tx-skeleton__bone tx-skeleton__bone--lg" style="width: 70%" />
      </div>
    </div>
    <div v-else-if="variant === 'text'" class="tx-skeleton__text" aria-hidden="true">
      <span
        v-for="l in lines"
        :key="l"
        class="tx-skeleton__bone"
        :style="{ width: l === lines ? '60%' : '100%' }"
      />
    </div>
    <span
      v-else
      class="tx-skeleton__bone tx-skeleton__bone--block"
      :style="{ width: width ?? '100%', height: height ?? '120px' }"
      aria-hidden="true"
    />
  </div>
</template>
