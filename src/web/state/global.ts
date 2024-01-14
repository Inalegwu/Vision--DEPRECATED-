import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { GlobalState } from "@shared/types";

export const globalState$ = observable<GlobalState>({
  appState: {
    firstLaunch: true,
    applicationId: undefined,
  },
  uiState: {
    distractionFreeMode: false,
    ambientBackground: false,
    readerLayout: "SinglePage",
    colorMode: "dark",
    layoutBackground: true,
    navPos: {
      x: window.outerWidth * 0.45,
      y: window.outerHeight * 0.92,
    },
  },
});

persistObservable(globalState$, {
  local: "global_state",
  pluginLocal: ObservablePersistLocalStorage,
});
