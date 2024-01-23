import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { KeyboardShortcutState } from "@src/shared/types";

export const keyboardShortcuts = observable<KeyboardShortcutState>({
  shortcuts: new Map(),
});

persistObservable(keyboardShortcuts, {
  local: "keyboard_shortcuts",
  pluginLocal: ObservablePersistLocalStorage,
});
