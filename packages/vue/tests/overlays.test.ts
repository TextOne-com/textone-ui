import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { h, ref } from "vue";
import TxPopover from "../src/components/TxPopover.vue";
import TxSheet from "../src/components/TxSheet.vue";

// ── TxSheet ───────────────────────────────────────────────────────────────

function renderSheet(props: Record<string, unknown> = {}) {
  const open = ref(true);
  render({
    setup: () => () =>
      h(
        TxSheet,
        {
          title: "Filtros",
          side: "right",
          ...props,
          open: open.value,
          "onUpdate:open": (v: boolean) => {
            open.value = v;
          },
        },
        { default: () => h("p", "Contenido del panel") },
      ),
  });
  return { open };
}

test("an open sheet is a dialog named by its title, with its content", async () => {
  renderSheet({ description: "Elija qué ver" });
  const dialog = await screen.findByRole("dialog", { name: "Filtros" });
  expect(dialog).toHaveTextContent("Contenido del panel");
  expect(dialog).toHaveAccessibleDescription("Elija qué ver");
});

test("the sheet's close button closes it", async () => {
  const { open } = renderSheet();
  await fireEvent.click(await screen.findByRole("button", { name: "Cerrar" }));
  expect(open.value).toBe(false);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("Escape closes the sheet", async () => {
  const { open } = renderSheet();
  const dialog = await screen.findByRole("dialog");
  await fireEvent.keyDown(dialog, { key: "Escape" });
  expect(open.value).toBe(false);
});

test("a sheet with hideTitle still has the title as its accessible name", async () => {
  renderSheet({ hideTitle: true, side: "bottom" });
  expect(await screen.findByRole("dialog", { name: "Filtros" })).toBeInTheDocument();
});

test("a closed sheet renders nothing", () => {
  const open = ref(false);
  render({
    setup: () => () => h(TxSheet, { title: "Filtros", open: open.value }, { default: () => "x" }),
  });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

// ── TxPopover ─────────────────────────────────────────────────────────────

function renderPopover() {
  render({
    setup: () => () =>
      h(
        TxPopover,
        { label: "Cuenta" },
        {
          trigger: () => h("button", { type: "button" }, "Mi cuenta"),
          default: ({ close }: { close: () => void }) => [
            h("p", "Aprobador local"),
            h("button", { type: "button", onClick: close }, "Listo"),
          ],
        },
      ),
  });
  return screen.getByRole("button", { name: "Mi cuenta" });
}

test("the popover panel is named by its label prop, not its trigger", async () => {
  const trigger = renderPopover();
  await fireEvent.click(trigger);
  expect(await screen.findByRole("dialog", { name: "Cuenta" })).toBeInTheDocument();
});

test("the trigger opens the popover panel", async () => {
  const trigger = renderPopover();
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await fireEvent.click(trigger);
  const panel = await screen.findByRole("dialog");
  expect(panel).toHaveTextContent("Aprobador local");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("Escape closes the popover", async () => {
  const trigger = renderPopover();
  await fireEvent.click(trigger);
  const panel = await screen.findByRole("dialog");
  await fireEvent.keyDown(panel, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("the default slot's close() closes the popover", async () => {
  const trigger = renderPopover();
  await fireEvent.click(trigger);
  await fireEvent.click(await screen.findByRole("button", { name: "Listo" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
