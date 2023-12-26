import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

export type CurrentlyReading = {
  id: string;
  page: number;
};

export type ReadingState = {
  currentlyReading: CurrentlyReading[];
};

export const readingState = observable<ReadingState>({
  currentlyReading: [],
});

persistObservable(readingState, {
  pluginLocal: ObservablePersistLocalStorage,
});
