import { fireEvent, render, screen } from "@testing-library/vue";
import { h, ref } from "vue";
import TxDateField from "../src/components/TxDateField.vue";
import TxDateRangeField from "../src/components/TxDateRangeField.vue";
import type { DateRange } from "../src/utils/dates";

// ── TxDateRangeField ──────────────────────────────────────────────────────

function renderRange(initial: DateRange | null, props: Record<string, unknown> = {}) {
  const model = ref<DateRange | null>(initial);
  render({
    setup: () => () =>
      h(TxDateRangeField, {
        label: "Período",
        today: "2025-11-15",
        ...props,
        modelValue: model.value,
        "onUpdate:modelValue": (v: DateRange | null) => {
          model.value = v;
        },
      }),
  });
  const trigger = screen
    .getAllByRole("button")
    .find((b) => b.getAttribute("aria-haspopup") === "dialog") as HTMLElement;
  return { model, trigger };
}

// Reka replaces the trigger's id, so the label names it through aria-labelledby, with the value.
test("a range field's trigger is named by its label and its value", () => {
  renderRange({ start: "2025-10-01", end: "2025-10-31" });
  expect(screen.getByRole("button", { name: /^Período Mes anterior 01\/10\/2025 – 31\/10\/2025$/ })).toBeInTheDocument();
});

test("a range field shows its placeholder when empty", () => {
  const { trigger } = renderRange(null);
  expect(trigger).toHaveTextContent("Elegir período");
});

test("picking 'Mes anterior' sets last month and the field names the preset", async () => {
  const { model, trigger } = renderRange(null);
  await fireEvent.click(trigger);
  const presets = await screen.findByRole("group", { name: "Períodos" });
  expect(presets).toBeInTheDocument();
  await fireEvent.click(screen.getByRole("button", { name: /Mes anterior/ }));
  expect(model.value).toEqual({ start: "2025-10-01", end: "2025-10-31" });
  expect(trigger).toHaveTextContent("Mes anterior");
  expect(trigger).toHaveTextContent("01/10/2025 – 31/10/2025");
});

test("a range that is no preset shows only its dates", () => {
  const { trigger } = renderRange({ start: "2025-03-04", end: "2025-03-20" });
  expect(trigger).toHaveTextContent("04/03/2025 – 20/03/2025");
  expect(trigger).not.toHaveTextContent("Mes anterior");
});

test("presets that fall outside min/max are not offered", async () => {
  const { trigger } = renderRange(null, { min: "2025-11-01" });
  await fireEvent.click(trigger);
  await screen.findByRole("group", { name: "Períodos" });
  expect(screen.getByRole("button", { name: /Últimos 7 días/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Este mes/ })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Mes anterior/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Últimos 30 días/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Este año/ })).not.toBeInTheDocument();
});

test("custom presets replace the default periods", async () => {
  const { model, trigger } = renderRange(null, {
    presets: [{ key: "y24", label: "Cierre 2024", range: { start: "2024-01-01", end: "2024-12-31" } }],
  });
  await fireEvent.click(trigger);
  await screen.findByRole("group", { name: "Períodos" });
  expect(screen.queryByRole("button", { name: /Mes anterior/ })).not.toBeInTheDocument();
  await fireEvent.click(screen.getByRole("button", { name: /Cierre 2024/ }));
  expect(model.value).toEqual({ start: "2024-01-01", end: "2024-12-31" });
});

test("the clear button of a clearable range sets it to null", async () => {
  const { model, trigger } = renderRange({ start: "2025-10-01", end: "2025-10-31" }, { clearable: true });
  await fireEvent.click(screen.getByRole("button", { name: "Quitar período" }));
  expect(model.value).toBeNull();
  expect(trigger).toHaveTextContent("Elegir período");
  expect(screen.queryByRole("button", { name: "Quitar período" })).not.toBeInTheDocument();
});

// ── TxDateField ───────────────────────────────────────────────────────────

function renderDate(initial: string, props: Record<string, unknown> = {}) {
  const model = ref(initial);
  render({
    setup: () => () =>
      h(TxDateField, {
        label: "Fecha",
        today: "2025-11-15",
        ...props,
        modelValue: model.value,
        "onUpdate:modelValue": (v: string) => {
          model.value = v;
        },
      }),
  });
  const input = screen.getByRole("textbox", { name: "Fecha" }) as HTMLInputElement;
  return { model, input };
}

test("digits typed alone get their slashes and commit as ISO", async () => {
  const { model, input } = renderDate("");
  await fireEvent.update(input, "3006");
  expect(input.value).toBe("30/06");
  expect(model.value).toBe("");
  await fireEvent.update(input, "30062025");
  expect(input.value).toBe("30/06/2025");
  expect(model.value).toBe("2025-06-30");
});

test("the weekday of the chosen date is shown beside it", async () => {
  const { input } = renderDate("2025-01-15");
  // 15 January 2025 was a Wednesday.
  expect(input.parentElement).toHaveTextContent(/mié/i);
  await fireEvent.update(input, "16/01/2025");
  expect(input.parentElement).toHaveTextContent(/jue/i);
});

test("hideWeekday leaves the weekday out", () => {
  const { input } = renderDate("2025-01-15", { hideWeekday: true });
  expect(input.parentElement).not.toHaveTextContent(/mié/i);
});

test("the clear button of a clearable date empties it", async () => {
  const { model, input } = renderDate("2025-06-30", { clearable: true });
  await fireEvent.click(screen.getByRole("button", { name: "Borrar fecha" }));
  expect(model.value).toBe("");
  expect(input.value).toBe("");
  expect(screen.queryByRole("button", { name: "Borrar fecha" })).not.toBeInTheDocument();
});

test("a date that is not clearable keeps its value when emptied", async () => {
  const { model, input } = renderDate("2025-06-30");
  expect(screen.queryByRole("button", { name: "Borrar fecha" })).not.toBeInTheDocument();
  await fireEvent.update(input, "");
  await fireEvent.blur(input);
  expect(model.value).toBe("2025-06-30");
  expect(input.value).toBe("30/06/2025");
});

test("Alt+ArrowDown opens the calendar, whose 'Hoy' chip commits today", async () => {
  const { model, input } = renderDate("");
  await fireEvent.keyDown(input, { key: "ArrowDown", altKey: true });
  await fireEvent.click(await screen.findByRole("button", { name: "Hoy" }));
  expect(model.value).toBe("2025-11-15");
  expect(input.value).toBe("15/11/2025");
});

test("a preset chip in the calendar commits its date; one outside the range is disabled", async () => {
  const { model, input } = renderDate("", {
    max: "2025-12-31",
    presets: [
      { label: "Cierre 2024", value: "2024-12-31" },
      { label: "Fin de 2026", value: "2026-12-31" },
    ],
  });
  await fireEvent.keyDown(input, { key: "ArrowDown", altKey: true });
  expect(await screen.findByRole("button", { name: "Fin de 2026" })).toBeDisabled();
  await fireEvent.click(screen.getByRole("button", { name: "Cierre 2024" }));
  expect(model.value).toBe("2024-12-31");
  expect(input.value).toBe("31/12/2024");
});

test("the 'Hoy' chip is not offered when today is outside the range", async () => {
  const { input } = renderDate("", { max: "2025-01-31", presets: [{ label: "Enero", value: "2025-01-31" }] });
  await fireEvent.keyDown(input, { key: "ArrowDown", altKey: true });
  await screen.findByRole("button", { name: "Enero" });
  expect(screen.queryByRole("button", { name: "Hoy" })).not.toBeInTheDocument();
});
