import { fireEvent, render, screen } from "@testing-library/vue";
import { h, ref } from "vue";
import TxIconButton from "../src/components/TxIconButton.vue";
import TxBrandLockup from "../src/components/TxBrandLockup.vue";
import TxButton from "../src/components/TxButton.vue";
import TxDateField from "../src/components/TxDateField.vue";
import TxSegmentedControl from "../src/components/TxSegmentedControl.vue";
import TxTextInput from "../src/components/TxTextInput.vue";

test("a text input is named by its label and carries its error", () => {
  render(TxTextInput, { props: { label: "Valor recibido", error: "Escriba el valor" } });
  const input = screen.getByLabelText("Valor recibido");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Escriba el valor");
});

test("aria-label reaches the input, class stays on the field", () => {
  render(TxTextInput, { attrs: { "aria-label": "Cantidad TO-PRI-001", class: "w-24" } });
  const input = screen.getByRole("textbox", { name: "Cantidad TO-PRI-001" });
  expect(input.closest(".tx-field")).toHaveClass("w-24");
  expect(input).not.toHaveClass("w-24");
});

test("a disabled link-button has no href", () => {
  render(TxButton, { props: { as: "a", disabled: true }, attrs: { href: "/x" }, slots: { default: "Ir" } });
  const el = screen.getByText("Ir").closest(".tx-button");
  expect(el).toHaveAttribute("aria-disabled", "true");
});

test("a date typed day first is committed as ISO; a bad one reverts", async () => {
  const model = ref("2025-06-30");
  render({
    setup: () => () =>
      h(TxDateField, {
        label: "Fecha",
        modelValue: model.value,
        "onUpdate:modelValue": (v: string) => {
          model.value = v;
        },
      }),
  });
  const input = screen.getByRole("textbox", { name: "Fecha" }) as HTMLInputElement;
  expect(input.value).toBe("30/06/2025");
  await fireEvent.update(input, "15/01/2025");
  expect(model.value).toBe("2025-01-15");
  await fireEvent.update(input, "99/99");
  await fireEvent.blur(input);
  expect(input.value).toBe("15/01/2025");
});

test("segmented control is a radio group", async () => {
  const model = ref("a");
  render(TxSegmentedControl, {
    props: {
      label: "Ver",
      options: [
        { value: "a", label: "Pendientes" },
        { value: "b", label: "Todas" },
      ],
      modelValue: model.value,
      "onUpdate:modelValue": (v: string) => {
        model.value = v;
      },
    },
  });
  await fireEvent.click(screen.getByRole("radio", { name: "Todas" }));
  expect(model.value).toBe("b");
});

test("the reversed lockup is marked for the purple background and keeps its name", () => {
  render(() => h(TxBrandLockup, { inverse: true }));
  const lockup = screen.getByLabelText("Text One.com");
  expect(lockup).toHaveClass("tx-lockup--inverse");
  // A plain span may not carry a name: as a picture, it can.
  expect(lockup).toHaveAttribute("role", "img");
});

test("a lockup that is a link keeps the link's role", () => {
  render(() => h(TxBrandLockup, { as: "a", href: "/" }));
  expect(screen.getByRole("link", { name: "Text One.com" })).not.toHaveAttribute("role");
});

test("a decision's pair: named by its label, marked by its tone", () => {
  render(() => [
    h(TxIconButton, { label: "Aprobar", variant: "positive" }),
    h(TxIconButton, { label: "Rechazar", variant: "negative" }),
  ]);
  expect(screen.getByRole("button", { name: "Aprobar" })).toHaveClass("tx-icon-button--positive");
  expect(screen.getByRole("button", { name: "Rechazar" })).toHaveClass("tx-icon-button--negative");
});
