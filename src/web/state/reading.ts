import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { ReadingState } from "@src/shared/types";

export const readingState = observable<ReadingState>({
  currentlyReading: [],
});

persistObservable(readingState, {
  local: "reading__state",
  pluginLocal: ObservablePersistLocalStorage,
});
