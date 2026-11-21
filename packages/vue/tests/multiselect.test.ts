import { fireEvent, render, screen, within } from "@testing-library/vue";
import { h, nextTick, ref } from "vue";
import TxMultiSelect from "../src/components/TxMultiSelect.vue";
import type { Option } from "../src/internal/types";

const accounts: Option[] = [
  { value: "a", label: "Librería Ángel", description: "Bogotá" },
  { value: "b", label: "Papelería Central", description: "Medellín" },
  { value: "c", label: "Distribuidora Norte", description: "Barranquilla" },
  { value: "d", label: "Colegio San José", description: "Cali" },
  { value: "e", label: "Editorial Mágica", description: "Bogotá" },
];

function renderMulti(initial: string[], props: Record<string, unknown> = {}) {
  const model = ref<string[]>(initial);
  const utils = render({
    setup: () => () =>
      h(TxMultiSelect, {
        label: "Cuentas",
        options: accounts,
        ...props,
        modelValue: model.value,
        "onUpdate:modelValue": (v: string[]) => {
          model.value = v;
        },
      }),
  });
  const input = screen.getByRole("combobox", { name: "Cuentas" }) as HTMLInputElement;
  return { model, input, ...utils };
}

async function openList(input: HTMLInputElement) {
  await fireEvent.click(input);
  return screen.findByRole("listbox");
}

async function typeSearch(input: HTMLInputElement, text: string) {
  await fireEvent.update(input, text);
  await nextTick();
}

const optionNames = () => screen.queryAllByRole("option").map((o) => o.textContent?.trim() ?? "");

test("shows chips up to maxChips, folding the rest into +N", () => {
  renderMulti(["a", "b", "c", "d"], { maxChips: 2 });
  expect(screen.getByText("Librería Ángel")).toBeInTheDocument();
  expect(screen.getByText("Papelería Central")).toBeInTheDocument();
  expect(screen.queryByText("Distribuidora Norte")).not.toBeInTheDocument();
  expect(screen.getByText("+2")).toBeInTheDocument();
});

test("count display shows the count label instead of chips", () => {
  renderMulti(["a", "c", "d"], { display: "count", countLabel: (n: number) => `${n} cuentas` });
  expect(screen.getByText("3 cuentas")).toBeInTheDocument();
  expect(screen.queryByText("Librería Ángel")).not.toBeInTheDocument();
});

test("count display says 'Todos' when every option is chosen", () => {
  renderMulti(["a", "b", "c", "d", "e"], { display: "count" });
  expect(screen.getByText("Todos")).toBeInTheDocument();
});

test("a chip's remove button takes out just that choice", async () => {
  const { model } = renderMulti(["a", "b"]);
  await fireEvent.click(screen.getByRole("button", { name: "Quitar Librería Ángel" }));
  expect(model.value).toEqual(["b"]);
  expect(screen.queryByText("Librería Ángel")).not.toBeInTheDocument();
});

test("Backspace in an empty search removes the last choice", async () => {
  const { model, input } = renderMulti(["a", "b", "c"]);
  await fireEvent.keyDown(input, { key: "Backspace" });
  expect(model.value).toEqual(["a", "b"]);
});

test("Backspace while there is search text keeps the choices", async () => {
  const { model, input } = renderMulti(["a", "b"]);
  await typeSearch(input, "pap");
  await fireEvent.keyDown(input, { key: "Backspace" });
  expect(model.value).toEqual(["a", "b"]);
});

test("the clear button empties the choice", async () => {
  const { model } = renderMulti(["a", "b"]);
  await fireEvent.click(screen.getByRole("button", { name: "Quitar todos" }));
  expect(model.value).toEqual([]);
});

test("'Seleccionar todos' selects every option, then 'Quitar todos' clears them", async () => {
  const { model, input } = renderMulti([]);
  const list = await openList(input);
  expect(within(document.body).getByText("0 / 5")).toBeInTheDocument();
  await fireEvent.click(screen.getByRole("button", { name: "Seleccionar todos (5)" }));
  expect(model.value).toEqual(["a", "b", "c", "d", "e"]);
  expect(list).toBeInTheDocument();
  // Two buttons are named "Quitar todos": the field's × and the list head's; the head's shows it.
  const headButton = screen
    .getAllByRole("button", { name: "Quitar todos" })
    .find((b) => b.textContent?.trim() === "Quitar todos");
  expect(headButton).toBeDefined();
  expect(within(document.body).getByText("5 / 5")).toBeInTheDocument();
  await fireEvent.click(headButton!);
  expect(model.value).toEqual([]);
});

test("searching narrows the list accent-insensitively, by words in any order", async () => {
  const { input } = renderMulti([]);
  await openList(input);
  await typeSearch(input, "magica");
  expect(optionNames()).toEqual([expect.stringContaining("Editorial Mágica")]);
  await typeSearch(input, "central papeleria");
  expect(optionNames()).toEqual([expect.stringContaining("Papelería Central")]);
});

test("searching also matches an option's description", async () => {
  const { input } = renderMulti([]);
  await openList(input);
  await typeSearch(input, "bogota");
  expect(optionNames()).toHaveLength(2);
  expect(optionNames().join(" ")).toContain("Librería Ángel");
  expect(optionNames().join(" ")).toContain("Editorial Mágica");
});

test("a search with no matches says so", async () => {
  const { input } = renderMulti([]);
  await openList(input);
  await typeSearch(input, "zzz");
  expect(screen.getByText("Sin resultados")).toBeInTheDocument();
});

test("while searching, the head selects only the options found", async () => {
  const { model, input } = renderMulti(["c"]);
  await openList(input);
  await typeSearch(input, "bogota");
  await fireEvent.click(screen.getByRole("button", { name: "Seleccionar los 2 encontrados" }));
  expect(model.value).toEqual(["c", "a", "e"]);
  // Now all found are chosen: the head offers to remove only those.
  await fireEvent.click(screen.getByRole("button", { name: "Quitar los encontrados" }));
  expect(model.value).toEqual(["c"]);
});

test("grouped options are listed under their group labels", async () => {
  const model = ref<string[]>([]);
  render({
    setup: () => () =>
      h(TxMultiSelect, {
        label: "Libros",
        options: [
          { value: "1", label: "Matemáticas 1", group: "Primaria" },
          { value: "2", label: "Química 10", group: "Secundaria" },
          { value: "3", label: "Matemáticas 2", group: "Primaria" },
        ],
        modelValue: model.value,
        "onUpdate:modelValue": (v: string[]) => {
          model.value = v;
        },
      }),
  });
  await openList(screen.getByRole("combobox", { name: "Libros" }) as HTMLInputElement);
  const primaria = screen.getByRole("group", { name: "Primaria" });
  expect(within(primaria).getAllByRole("option")).toHaveLength(2);
  const secundaria = screen.getByRole("group", { name: "Secundaria" });
  expect(within(secundaria).getByRole("option")).toHaveTextContent("Química 10");
});

test("choosing an option adds it and keeps the list open", async () => {
  const { model, input } = renderMulti(["a"]);
  await openList(input);
  await fireEvent.click(screen.getByRole("option", { name: /Distribuidora Norte/ }));
  expect(model.value).toEqual(["a", "c"]);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});
