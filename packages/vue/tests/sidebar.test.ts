import { fireEvent, render, screen } from "@testing-library/vue";
import { h, nextTick } from "vue";
import TxSidebar from "../src/components/TxSidebar.vue";
import TxSidebarGroup from "../src/components/TxSidebarGroup.vue";
import TxSidebarItem from "../src/components/TxSidebarItem.vue";

function renderSidebar(props: Record<string, unknown> = {}, badge: number | string = 3) {
  render({
    setup: () => () =>
      h(TxSidebar, props, {
        default: () =>
          h(TxSidebarGroup, { label: "Distribución" }, () => [
            h(TxSidebarItem, { label: "Remisiones", href: "#remisiones", active: true }),
            h(TxSidebarItem, {
              label: "Aprobaciones",
              href: "#aprobaciones",
              badge,
              badgeLabel: `${badge} pendientes`,
            }),
          ]),
      }),
  });
  return screen.getByRole("navigation", { name: "Principal" });
}

/** jsdom has no matchMedia: answer as a desk computer with a mouse and a wide screen. */
function stubPointerDevice() {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(hover: hover) and (pointer: fine)",
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// ── Toggle behaviour ──────────────────────────────────────────────────────

test("the foot button collapses and expands a toggle sidebar", async () => {
  const nav = renderSidebar();
  expect(nav).not.toHaveAttribute("data-collapsed");
  const button = screen.getByRole("button", { name: "Colapsar menú" });
  expect(button).toHaveAttribute("aria-expanded", "true");

  await fireEvent.click(button);
  expect(nav).toHaveAttribute("data-collapsed", "true");
  expect(button).toHaveAccessibleName("Expandir menú");
  expect(button).toHaveAttribute("aria-expanded", "false");

  await fireEvent.click(button);
  expect(nav).not.toHaveAttribute("data-collapsed");
});

test("a toggle sidebar remembers being collapsed under its storage key", async () => {
  renderSidebar({ storageKey: "nav-test" });
  await fireEvent.click(screen.getByRole("button", { name: "Colapsar menú" }));
  expect(localStorage.getItem("nav-test")).toBe("true");
});

test("a toggle sidebar starts collapsed when the storage says so", () => {
  localStorage.setItem("nav-test", "true");
  const nav = renderSidebar({ storageKey: "nav-test" });
  expect(nav).toHaveAttribute("data-collapsed", "true");
  expect(screen.getByRole("button", { name: "Expandir menú" })).toBeInTheDocument();
});

test("an empty storage key stores nothing", async () => {
  renderSidebar({ storageKey: "" });
  await fireEvent.click(screen.getByRole("button", { name: "Colapsar menú" }));
  expect(localStorage.length).toBe(0);
});

test("Ctrl+B toggles the sidebar, but not while typing in a field", async () => {
  const nav = renderSidebar();
  await fireEvent.keyDown(document.body, { key: "b", ctrlKey: true });
  expect(nav).toHaveAttribute("data-collapsed", "true");

  const input = document.createElement("input");
  document.body.append(input);
  await fireEvent.keyDown(input, { key: "b", ctrlKey: true });
  expect(nav).toHaveAttribute("data-collapsed", "true");
  input.remove();
});

// ── Items ─────────────────────────────────────────────────────────────────

test("items are links in a named group; the active one is the current page", () => {
  renderSidebar();
  expect(screen.getByRole("group", { name: "Distribución" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Remisiones" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: /Aprobaciones/ })).not.toHaveAttribute("aria-current");
});

test("an item's badge shows its count and reads its label", () => {
  renderSidebar({}, 3);
  const item = screen.getByRole("link", { name: /Aprobaciones/ });
  expect(item).toHaveTextContent("3");
  expect(item).toHaveAccessibleName(/^Aprobaciones\s*,\s*3 pendientes$/);
});

test("a badge of 0 is hidden", () => {
  renderSidebar({}, 0);
  const item = screen.getByRole("link", { name: /Aprobaciones/ });
  expect(item).not.toHaveTextContent("0");
  expect(item).toHaveAccessibleName("Aprobaciones");
});

// ── Hover behaviour ───────────────────────────────────────────────────────

test("a hover sidebar opens over the page shortly after the pointer enters", async () => {
  stubPointerDevice();
  vi.useFakeTimers();
  const nav = renderSidebar({ behavior: "hover" });
  expect(nav).toHaveAttribute("data-behavior", "hover");
  expect(nav).toHaveAttribute("data-collapsed", "true");

  await fireEvent.mouseEnter(nav);
  await vi.advanceTimersByTimeAsync(50);
  expect(nav).toHaveAttribute("data-collapsed", "true");
  await vi.advanceTimersByTimeAsync(60);
  expect(nav).not.toHaveAttribute("data-collapsed");
  expect(nav).toHaveAttribute("data-overlay", "true");
});

test("choosing an item closes a hover sidebar", async () => {
  stubPointerDevice();
  vi.useFakeTimers();
  const nav = renderSidebar({ behavior: "hover" });
  await fireEvent.mouseEnter(nav);
  await vi.advanceTimersByTimeAsync(100);
  expect(nav).not.toHaveAttribute("data-collapsed");

  await fireEvent.click(screen.getByRole("link", { name: /Aprobaciones/ }));
  expect(nav).toHaveAttribute("data-collapsed", "true");
});

test("a hover sidebar closes after the pointer leaves", async () => {
  stubPointerDevice();
  vi.useFakeTimers();
  const nav = renderSidebar({ behavior: "hover" });
  await fireEvent.mouseEnter(nav);
  await vi.advanceTimersByTimeAsync(100);
  await fireEvent.mouseLeave(nav);
  await vi.advanceTimersByTimeAsync(200);
  expect(nav).toHaveAttribute("data-collapsed", "true");
});

test("the pin button keeps a hover sidebar open and remembers it", async () => {
  stubPointerDevice();
  const nav = renderSidebar({ behavior: "hover", storageKey: "nav-test" });
  const pin = screen.getByRole("button", { name: "Fijar menú abierto" });
  expect(pin).toHaveAttribute("aria-pressed", "false");
  expect(pin).not.toHaveAttribute("aria-expanded");

  await fireEvent.click(pin);
  expect(pin).toHaveAttribute("aria-pressed", "true");
  expect(pin).toHaveAccessibleName("Soltar menú");
  expect(nav).not.toHaveAttribute("data-collapsed");
  expect(nav).not.toHaveAttribute("data-overlay");
  expect(localStorage.getItem("nav-test-pinned")).toBe("true");

  await fireEvent.click(pin);
  expect(pin).toHaveAttribute("aria-pressed", "false");
  expect(nav).toHaveAttribute("data-collapsed", "true");
});

test("on a touch device a hover sidebar behaves as a toggle", async () => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  const nav = renderSidebar({ behavior: "hover" });
  await nextTick();
  expect(nav).toHaveAttribute("data-behavior", "toggle");
  expect(screen.getByRole("button", { name: "Colapsar menú" })).toHaveAttribute("aria-expanded", "true");
});
