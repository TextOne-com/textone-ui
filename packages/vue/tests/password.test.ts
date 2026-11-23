import { fireEvent, render, screen } from "@testing-library/vue";
import { h, ref } from "vue";
import TxPasswordInput from "../src/components/TxPasswordInput.vue";

function renderPassword(initial = "", props: Record<string, unknown> = {}) {
  const model = ref(initial);
  render({
    setup: () => () =>
      h(TxPasswordInput, {
        label: "Contraseña",
        ...props,
        modelValue: model.value,
        "onUpdate:modelValue": (v: string) => {
          model.value = v;
        },
      }),
  });
  // A password input has no ARIA role: it is found by its label.
  const input = screen.getByLabelText("Contraseña") as HTMLInputElement;
  return { model, input };
}

test("the text is hidden, labelled, and never spell-checked or capitalised", () => {
  const { input } = renderPassword("secreta");
  expect(input).toHaveAttribute("type", "password");
  expect(input).toHaveAttribute("autocomplete", "current-password");
  expect(input).toHaveAttribute("spellcheck", "false");
  expect(input).toHaveAttribute("autocapitalize", "off");
});

test("typing updates the model", async () => {
  const { model, input } = renderPassword();
  await fireEvent.update(input, "caballo bateria grapa");
  expect(model.value).toBe("caballo bateria grapa");
});

test("the show button reveals the text, says so, and gives focus back with the caret kept", async () => {
  const { input } = renderPassword("caballo bateria");
  input.focus();
  input.setSelectionRange(3, 3);
  const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(toggle).toHaveAttribute("aria-controls", input.id);

  await fireEvent.click(toggle);
  expect(input).toHaveAttribute("type", "text");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(input).toHaveFocus();
  expect(input.selectionStart).toBe(3);

  await fireEvent.click(toggle);
  expect(input).toHaveAttribute("type", "password");
});

test("the show button is a real button: reachable by keyboard and never submits a form", () => {
  renderPassword("x");
  const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
  expect(toggle).toHaveAttribute("type", "button");
  expect(toggle).not.toHaveAttribute("tabindex");
});

test("no show button when it is turned off or the field is disabled", () => {
  renderPassword("x", { revealable: false });
  renderPassword("y", { disabled: true, label: "Otra" });
  expect(screen.queryByRole("button", { name: "Mostrar contraseña" })).not.toBeInTheDocument();
});

test("a new password asks the browser for a new-password suggestion", () => {
  const { input } = renderPassword("", { autocomplete: "new-password" });
  expect(input).toHaveAttribute("autocomplete", "new-password");
});

test("Caps Lock is announced while it is on, and the warning goes with the focus", async () => {
  const { input } = renderPassword();
  const live = document.querySelector(".tx-password__caps");
  expect(live).toHaveAttribute("aria-live", "polite");

  // jsdom's KeyboardEvent never reports Caps Lock: give the event one.
  const caps = new KeyboardEvent("keyup", { key: "A" });
  Object.defineProperty(caps, "getModifierState", { value: (k: string) => k === "CapsLock" });
  input.dispatchEvent(caps);
  expect(await screen.findByText("Bloq Mayús está activado")).toBeInTheDocument();

  const off = new KeyboardEvent("keyup", { key: "a" });
  Object.defineProperty(off, "getModifierState", { value: () => false });
  input.dispatchEvent(off);
  await vi.waitFor(() => expect(screen.queryByText("Bloq Mayús está activado")).not.toBeInTheDocument());

  input.dispatchEvent(caps);
  await screen.findByText("Bloq Mayús está activado");
  await fireEvent.blur(input);
  await vi.waitFor(() => expect(screen.queryByText("Bloq Mayús está activado")).not.toBeInTheDocument());
});

test("an error is read with the field", () => {
  const { input } = renderPassword("", { error: "Correo o contraseña incorrectos" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Correo o contraseña incorrectos");
});

test("attributes that are not props reach the input; class reaches the wrapper", () => {
  render(() => h(TxPasswordInput, { label: "Clave", name: "password", class: "w-72", "data-testid": "pw" }));
  const input = screen.getByLabelText("Clave");
  expect(input).toHaveAttribute("name", "password");
  expect(input).toHaveAttribute("data-testid", "pw");
  expect(input.closest(".tx-field")).toHaveClass("w-72");
});
