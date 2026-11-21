import type { InjectionKey, Ref } from "vue";

/** What a TxSidebar shares with its groups and items. */
export type SidebarContext = {
  collapsed: Readonly<Ref<boolean>>;
  /** Tooltips carry the titles on the rail — not in hover mode, where the rail opens itself. */
  tooltips: Readonly<Ref<boolean>>;
  /** The active item reports its element, so the sidebar can slide its indicator to it. */
  setActive: (el: HTMLElement | null) => void;
  /** An item was chosen: in hover mode the sidebar closes. */
  onSelect: () => void;
};

export const sidebarKey: InjectionKey<SidebarContext> = Symbol("tx-sidebar");
