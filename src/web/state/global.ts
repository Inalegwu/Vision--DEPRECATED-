import { observable } from "@legendapp/state";
import { GlobalState } from "@shared/types";

export const globalState$ = observable<GlobalState>({
  appState: {
    firstLaunch: true,
    applicationId: undefined,
  },
  uiState: {},
});
