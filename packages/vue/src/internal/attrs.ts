import { computed, useAttrs } from "vue";

/**
 * Splits fallthrough attributes: `class` and `style` go on a component's outer element, every
 * other attribute (aria-label, name, data-testid, listeners) on the control inside it — so
 * `<TxTextInput aria-label="Cantidad TO-PRI-001" class="w-24">` labels the input and sizes the
 * field.
 */
export function useSplitAttrs() {
  const attrs = useAttrs();
  const root = computed(() => ({ class: attrs.class, style: attrs.style }));
  const control = computed(() => {
    const { class: _c, style: _s, ...rest } = attrs;
    return rest;
  });
  return { root, control };
}
