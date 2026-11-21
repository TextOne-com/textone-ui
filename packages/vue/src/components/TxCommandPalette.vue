<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from "reka-ui";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import type { CommandItem } from "../internal/types";
import { matchesAll } from "../utils/search";


/**
 * Go anywhere by typing: ⌘K / Ctrl+K (never while typing in a field… except this one) opens it
 * from any screen. Your `items` are filtered by every word, accents folded; for results that
 * come from a server, listen to `search` and pass them in (with `loading`). Arrows move, Enter
 * chooses (`select`), Escape closes. Recent choices come first when nothing is typed.
 */
const props = withDefaults(
  defineProps<{
    items: CommandItem[];
    placeholder?: string;
    loading?: boolean;
    title?: string;
    nothingFound?: string;
    shortcut?: boolean;
    /** localStorage key for recent choices; "" for none. */
    recentKey?: string;
    recentLabel?: string;
    /** At most this many per group while typing. */
    perGroup?: number;
  }>(),
  {
    placeholder: "Buscar pantallas, cuentas, documentos…",
    title: "Buscar",
    nothingFound: "Nada coincide.",
    shortcut: true,
    recentKey: "tx-command-recent",
    recentLabel: "Recientes",
    perGroup: 6,
  },
);
const open = defineModel<boolean>("open", { default: false });
const query = defineModel<string>("query", { default: "" });
const emit = defineEmits<{ select: [item: CommandItem]; search: [query: string] }>();

const listId = useId();
const input = ref<HTMLInputElement>();
const active = ref(0);

function readRecent(): string[] {
  if (!props.recentKey) return [];
  try {
    return JSON.parse(localStorage.getItem(props.recentKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}
const recent = ref<string[]>(readRecent());
function remember(id: string) {
  recent.value = [id, ...recent.value.filter((r) => r !== id)].slice(0, 5);
  if (!props.recentKey) return;
  try {
    localStorage.setItem(props.recentKey, JSON.stringify(recent.value));
  } catch {
    // Storage blocked: recents last for this page.
  }
}

const groups = computed(() => {
  const q = query.value.trim();
  const byGroup = new Map<string, CommandItem[]>();
  if (!q) {
    const byId = new Map(props.items.map((i) => [i.id, i]));
    const recents = recent.value.map((id) => byId.get(id)).filter((i): i is CommandItem => !!i);
    if (recents.length) byGroup.set(props.recentLabel, recents);
  }
  for (const item of props.items) {
    if (q && !matchesAll(q, [item.label, item.description, item.keywords])) continue;
    const list = byGroup.get(item.group) ?? [];
    if (q && list.length >= props.perGroup) continue;
    list.push(item);
    byGroup.set(item.group, list);
  }
  return [...byGroup].map(([label, items]) => ({ label, items }));
});
const flat = computed(() => groups.value.flatMap((g) => g.items.map((item) => ({ item, group: g.label }))));
const optionId = (i: number) => `${listId}-${i}`;

watch(query, (q) => {
  active.value = 0;
  emit("search", q);
});
watch(open, async (isOpen) => {
  if (!isOpen) return;
  query.value = "";
  active.value = 0;
  recent.value = readRecent();
  await nextTick();
  input.value?.focus();
});

function choose(item: CommandItem | undefined) {
  if (!item) return;
  remember(item.id);
  open.value = false;
  emit("select", item);
}

async function onKey(event: KeyboardEvent) {
  const count = flat.value.length;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!count) return;
    active.value = (active.value + (event.key === "ArrowDown" ? 1 : count - 1)) % count;
    await nextTick();
    document.getElementById(optionId(active.value))?.scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter") {
    event.preventDefault();
    choose(flat.value[active.value]?.item);
  }
}

function onGlobalKey(event: KeyboardEvent) {
  if (!props.shortcut) return;
  if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
  event.preventDefault();
  open.value = !open.value;
}
onMounted(() => window.addEventListener("keydown", onGlobalKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onGlobalKey));

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
defineExpose({ shortcutHint: isMac ? "⌘K" : "Ctrl K" });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="tx-sheet__overlay tx-command__overlay" />
      <DialogContent class="tx-command" @open-auto-focus.prevent>
        <VisuallyHidden as-child><DialogTitle>{{ title }}</DialogTitle></VisuallyHidden>
        <VisuallyHidden as-child><DialogDescription>{{ placeholder }}</DialogDescription></VisuallyHidden>
        <div class="tx-command__search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            ref="input"
            v-model="query"
            class="tx-command__input"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="true"
            :aria-controls="listId"
            :aria-activedescendant="flat.length ? optionId(active) : undefined"
            :aria-label="title"
            :placeholder="placeholder"
            autocomplete="off"
            spellcheck="false"
            @keydown="onKey"
          />
          <span v-if="loading" class="tx-command__spinner" aria-hidden="true" />
          <kbd class="tx-command__kbd">Esc</kbd>
        </div>
        <div :id="listId" class="tx-command__list" role="listbox" :aria-label="title">
          <p v-if="!flat.length && !loading" class="tx-command__empty">{{ nothingFound }}</p>
          <template v-for="g in groups" :key="g.label">
            <div class="tx-command__group" role="presentation">{{ g.label }}</div>
            <div
              v-for="item in g.items"
              :id="optionId(flat.findIndex((f) => f.item === item && f.group === g.label))"
              :key="`${g.label}-${item.id}`"
              class="tx-command__item"
              role="option"
              :aria-selected="flat[active]?.item === item && flat[active]?.group === g.label"
              :data-active="(flat[active]?.item === item && flat[active]?.group === g.label) || undefined"
              @mousemove="active = flat.findIndex((f) => f.item === item && f.group === g.label)"
              @click="choose(item)"
            >
              <span class="tx-command__icon" aria-hidden="true">
                <component :is="item.icon" v-if="item.icon" :size="18" stroke="2" />
              </span>
              <span class="tx-command__text">
                <span class="tx-command__label">{{ item.label }}</span>
                <span v-if="item.description" class="tx-command__description">{{ item.description }}</span>
              </span>
              <kbd v-if="item.hint" class="tx-command__kbd">{{ item.hint }}</kbd>
              <svg class="tx-command__enter" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 10l-4 4 4 4M5 14h11a3 3 0 0 0 3-3V5" /></svg>
            </div>
          </template>
        </div>
        <footer class="tx-command__foot" aria-hidden="true">
          <span><kbd class="tx-command__kbd">↑</kbd><kbd class="tx-command__kbd">↓</kbd> moverse</span>
          <span><kbd class="tx-command__kbd">Enter</kbd> abrir</span>
          <span><kbd class="tx-command__kbd">Esc</kbd> cerrar</span>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
