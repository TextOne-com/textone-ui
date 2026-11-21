<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { sidebarKey } from "../internal/sidebar";

/**
 * The navigation column of a staff tool: groups of items with an icon and a title, a purple pill
 * that slides to the active item, counts that pulse when they change. Two behaviours:
 *
 * - `hover` — an icon rail that opens over the page while the pointer (or keyboard focus) is on
 *   it and closes again as soon as a destination is chosen, when the pointer leaves, or on
 *   Escape. The page never moves. The foot's button pins it open instead (remembered).
 * - `toggle` — open or collapsed by the foot's button or ⌘/Ctrl+B (never while typing); the
 *   page makes room. Below `autoCollapseBelow` px the rail is used.
 *
 * On devices without hover (touch), `hover` behaves as `toggle`. All motion stops under reduced
 * motion. Put TxSidebarGroup / TxSidebarItem in the default slot; `footer` shows only while open.
 */
const props = withDefaults(
  defineProps<{
    behavior?: "hover" | "toggle";
    label?: string;
    width?: number;
    collapsedWidth?: number;
    /** localStorage key for the remembered choice (collapsed, or pinned in hover); "" for none. */
    storageKey?: string;
    autoCollapseBelow?: number;
    shortcut?: boolean;
    collapseLabel?: string;
    expandLabel?: string;
    pinLabel?: string;
    unpinLabel?: string;
    /** Toggle behaviour only: bind with v-model:collapsed to control it. */
    collapsed?: boolean;
  }>(),
  {
    behavior: "toggle",
    label: "Principal",
    width: 232,
    collapsedWidth: 64,
    storageKey: "tx-sidebar-collapsed",
    autoCollapseBelow: 1200,
    shortcut: true,
    collapseLabel: "Colapsar menú",
    expandLabel: "Expandir menú",
    pinLabel: "Fijar menú abierto",
    unpinLabel: "Soltar menú",
    collapsed: undefined,
  },
);
const emit = defineEmits<{ "update:collapsed": [value: boolean] }>();

// Hover mode remembers "pinned", toggle mode "collapsed": two meanings, two keys.
const key = props.storageKey
  ? props.behavior === "hover"
    ? `${props.storageKey}-pinned`
    : props.storageKey
  : "";

function readStored(): boolean | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : raw === "true";
  } catch {
    return null;
  }
}
function store(value: boolean) {
  if (!key) return;
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}

const canHover = ref(true);
const hoverMode = computed(() => props.behavior === "hover" && canHover.value);

// ── Toggle behaviour ──────────────────────────────────────────────────────
const preference = ref<boolean>(readStored() ?? false);
const narrow = ref(false);
const toggleCollapsed = computed<boolean>(
  () => props.collapsed ?? (narrow.value || preference.value),
);

// ── Hover behaviour ───────────────────────────────────────────────────────
// In hover mode the stored value means "pinned open".
const pinned = ref<boolean>(props.behavior === "hover" ? (readStored() ?? false) : false);
const peeking = ref(false);
/** After a choice, stay closed until the pointer leaves: it is still over the rail. */
const suppressed = ref(false);
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function clearTimers() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
}
function peek(open: boolean, delay: number) {
  if (!hoverMode.value || pinned.value) return;
  clearTimers();
  const run = () => {
    peeking.value = open && !suppressed.value;
  };
  if (delay > 0) {
    if (open) openTimer = setTimeout(run, delay);
    else closeTimer = setTimeout(run, delay);
  } else run();
}
function onEnter() {
  peek(true, 90);
}
function onLeave() {
  suppressed.value = false;
  peek(false, 180);
}
function onFocusIn() {
  if (!suppressed.value) peek(true, 0);
}
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (!next || !nav.value?.contains(next)) {
    suppressed.value = false;
    peek(false, 0);
  }
}
function onEscape() {
  if (!hoverMode.value || pinned.value) return;
  suppressed.value = true;
  peek(false, 0);
}

// ── What is shown ─────────────────────────────────────────────────────────
const isCollapsed = computed<boolean>(() =>
  hoverMode.value ? !(pinned.value || peeking.value) : toggleCollapsed.value,
);
/** Hover mode, open over the page rather than beside it. */
const overlaying = computed(() => hoverMode.value && peeking.value && !pinned.value);
/** The width the layout keeps for the sidebar. */
const reserved = computed(() =>
  hoverMode.value
    ? pinned.value
      ? props.width
      : props.collapsedWidth
    : isCollapsed.value
      ? props.collapsedWidth
      : props.width,
);

function onFootButton() {
  if (hoverMode.value) {
    pinned.value = !pinned.value;
    peeking.value = false;
    store(pinned.value);
    return;
  }
  const next = !toggleCollapsed.value;
  preference.value = next;
  narrow.value = false;
  emit("update:collapsed", next);
  store(next);
}
const footLabel = computed(() =>
  hoverMode.value
    ? pinned.value
      ? props.unpinLabel
      : props.pinLabel
    : isCollapsed.value
      ? props.expandLabel
      : props.collapseLabel,
);

// ── The sliding indicator ─────────────────────────────────────────────────
const nav = ref<HTMLElement>();
const list = ref<HTMLElement>();
const activeEl = ref<HTMLElement | null>(null);
const indicator = ref<{ top: number; height: number } | null>(null);
const ready = ref(false);

function place() {
  const el = activeEl.value;
  indicator.value = el ? { top: el.offsetTop, height: el.offsetHeight } : null;
  if (el && !ready.value) requestAnimationFrame(() => (ready.value = true));
}

provide(sidebarKey, {
  collapsed: isCollapsed,
  tooltips: computed(() => !hoverMode.value),
  setActive: (el) => {
    activeEl.value = el;
    void nextTick(place);
  },
  onSelect: () => {
    if (!hoverMode.value || pinned.value) return;
    suppressed.value = true;
    clearTimers();
    peeking.value = false;
  },
});

// ── Viewport, shortcut, layout changes ────────────────────────────────────
let narrowQuery: MediaQueryList | undefined;
let hoverQuery: MediaQueryList | undefined;
let observer: ResizeObserver | undefined;
const onNarrow = () => {
  narrow.value = !!narrowQuery?.matches;
};
const onHoverCapability = () => {
  canHover.value = hoverQuery ? hoverQuery.matches : true;
};
function onKey(event: KeyboardEvent) {
  if (hoverMode.value || !props.shortcut) return;
  if (event.key.toLowerCase() !== "b" || !(event.metaKey || event.ctrlKey)) return;
  const target = event.target as HTMLElement | null;
  // Never while typing: ⌘B is bold in a rich field, and a stray toggle loses the place.
  if (target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
  event.preventDefault();
  onFootButton();
}

onMounted(() => {
  if (typeof matchMedia === "function") {
    if (props.autoCollapseBelow > 0) {
      narrowQuery = matchMedia(`(max-width: ${props.autoCollapseBelow - 1}px)`);
      onNarrow();
      narrowQuery.addEventListener("change", onNarrow);
    }
    hoverQuery = matchMedia("(hover: hover) and (pointer: fine)");
    onHoverCapability();
    hoverQuery.addEventListener("change", onHoverCapability);
  }
  window.addEventListener("keydown", onKey);
  if (typeof ResizeObserver === "function" && list.value) {
    observer = new ResizeObserver(place);
    observer.observe(list.value);
  }
  place();
});
onBeforeUnmount(() => {
  clearTimers();
  narrowQuery?.removeEventListener("change", onNarrow);
  hoverQuery?.removeEventListener("change", onHoverCapability);
  window.removeEventListener("keydown", onKey);
  observer?.disconnect();
});
watch(isCollapsed, () => void nextTick(place));

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const shortcutHint = isMac ? "⌘B" : "Ctrl B";
</script>

<template>
  <TooltipProvider :delay-duration="250" :skip-delay-duration="150">
    <div
      class="tx-sidebar-slot"
      :style="{
        '--tx-sidebar-width': `${width}px`,
        '--tx-sidebar-collapsed': `${collapsedWidth}px`,
        width: `${reserved}px`,
      }"
    >
      <nav
        ref="nav"
        class="tx-sidebar"
        :data-collapsed="isCollapsed || undefined"
        :data-overlay="overlaying || undefined"
        :data-behavior="hoverMode ? 'hover' : 'toggle'"
        :aria-label="label"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
        @keydown.esc="onEscape"
      >
        <div ref="list" class="tx-sidebar__list">
          <span
            v-if="indicator"
            class="tx-sidebar__indicator"
            :data-ready="ready || undefined"
            :style="{ transform: `translateY(${indicator.top}px)`, height: `${indicator.height}px` }"
            aria-hidden="true"
          />
          <slot />
        </div>

        <div class="tx-sidebar__foot">
          <div v-if="$slots.footer" class="tx-sidebar__footer"><slot name="footer" /></div>
          <button
            type="button"
            class="tx-sidebar__toggle"
            :aria-label="footLabel"
            :aria-pressed="hoverMode ? pinned : undefined"
            :aria-expanded="hoverMode ? undefined : !isCollapsed"
            :title="hoverMode || !shortcut ? footLabel : `${footLabel} (${shortcutHint})`"
            @click="onFootButton"
          >
            <svg v-if="hoverMode" viewBox="0 0 24 24" aria-hidden="true" class="tx-sidebar__toggle-icon" :data-pinned="pinned || undefined">
              <path d="M15 4.5l-4 4-4 1.5-1.5 1.5 7 7 1.5-1.5 1.5-4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 15l-4.5 4.5M14.5 4l5.5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="tx-sidebar__toggle-icon tx-sidebar__toggle-icon--flip">
              <path d="M4 6h16M4 12h10M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M19 9l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="tx-sidebar__label">{{ footLabel }}</span>
            <kbd v-if="!hoverMode && shortcut" class="tx-sidebar__kbd">{{ shortcutHint }}</kbd>
          </button>
        </div>
      </nav>
    </div>
  </TooltipProvider>
</template>
