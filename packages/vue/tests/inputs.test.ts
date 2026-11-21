import { fireEvent, render, screen } from "@testing-library/vue";
import { h, ref } from "vue";
import TxAvatar from "../src/components/TxAvatar.vue";
import TxSelect from "../src/components/TxSelect.vue";
import TxTextInput from "../src/components/TxTextInput.vue";

// ── TxTextInput ───────────────────────────────────────────────────────────

function renderText(initial: string, props: Record<string, unknown> = {}) {
  const model = ref(initial);
  render({
    setup: () => () =>
      h(TxTextInput, {
        label: "Nota",
        ...props,
        modelValue: model.value,
        "onUpdate:modelValue": (v: string) => {
          model.value = v;
        },
      }),
  });
  const input = screen.getByRole("textbox", { name: "Nota" }) as HTMLInputElement;
  return { model, input };
}

test("a clearable input's × empties it and gives focus back to the input", async () => {
  const { model, input } = renderText("Pendiente", { clearable: true });
  await fireEvent.click(screen.getByRole("button", { name: "Borrar" }));
  expect(model.value).toBe("");
  expect(input).toHaveValue("");
  expect(input).toHaveFocus();
  expect(screen.queryByRole("button", { name: "Borrar" })).not.toBeInTheDocument();
});

test("Escape empties a clearable input", async () => {
  const { model, input } = renderText("Pendiente", { clearable: true });
  await fireEvent.keyDown(input, { key: "Escape" });
  expect(model.value).toBe("");
});

test("Escape leaves a non-clearable input alone", async () => {
  const { model, input } = renderText("Pendiente");
  await fireEvent.keyDown(input, { key: "Escape" });
  expect(model.value).toBe("Pendiente");
  expect(screen.queryByRole("button", { name: "Borrar" })).not.toBeInTheDocument();
});

test("a read-only or empty input offers no clear button", () => {
  renderText("Fijo", { clearable: true, readonly: true });
  expect(screen.queryByRole("button", { name: "Borrar" })).not.toBeInTheDocument();
});

test("the counter appears once the text reaches 80 % of maxlength", async () => {
  const { input } = renderText("", { maxlength: 10 });
  await fireEvent.update(input, "1234567");
  expect(screen.queryByText("7 / 10")).not.toBeInTheDocument();
  await fireEvent.update(input, "12345678");
  expect(screen.getByText("8 / 10")).toBeInTheDocument();
  expect(input).toHaveAttribute("maxlength", "10");
});

// ── TxSelect ──────────────────────────────────────────────────────────────

test("a select lists grouped options under their labels, with descriptions", async () => {
  render(TxSelect, {
    props: {
      label: "Sección",
      options: [
        { value: "p1", label: "Primero", group: "Primaria", description: "6 a 7 años" },
        { value: "s1", label: "Sexto", group: "Secundaria" },
        { value: "p2", label: "Segundo", group: "Primaria" },
      ],
    },
  });
  await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
  const primaria = await screen.findByRole("group", { name: "Primaria" });
  expect(primaria).toHaveTextContent("Primero");
  expect(primaria).toHaveTextContent("Segundo");
  expect(screen.getByRole("group", { name: "Secundaria" })).toHaveTextContent("Sexto");
  expect(screen.getByText("6 a 7 años")).toBeInTheDocument();
});

test("a select's trigger is named by its label", () => {
  render(TxSelect, { props: { label: "Sección", options: [{ value: "a", label: "A" }] } });
  expect(screen.getByRole("combobox", { name: "Sección" })).toBeInTheDocument();
});

// ── TxAvatar ──────────────────────────────────────────────────────────────

test("an avatar shows the initials of the first and last word of the name", () => {
  const { container } = render(TxAvatar, { props: { name: "Aprobador local" } });
  expect(container).toHaveTextContent("AL");
  const { container: single } = render(TxAvatar, { props: { name: "  clerk  " } });
  expect(single).toHaveTextContent(/^C$/);
  const { container: three } = render(TxAvatar, { props: { name: "María José Pérez" } });
  expect(three).toHaveTextContent("MP");
});

test("an avatar with no name is an empty outline", () => {
  const { container } = render(TxAvatar, { props: { name: null } });
  const avatar = container.firstElementChild as HTMLElement;
  expect(avatar).toHaveAttribute("data-empty", "true");
  expect(avatar).toHaveTextContent("");
  expect(avatar).toHaveAttribute("aria-hidden", "true");
});
