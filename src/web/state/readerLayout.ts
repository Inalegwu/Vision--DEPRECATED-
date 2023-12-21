import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { ReaderLayout } from "@shared/types";

type ReaderLayoutState = {
  layout: ReaderLayout;
};

export const readerLayout = observable<ReaderLayoutState>({
  layout: "SinglePage",
});

persistObservable(readerLayout,{
  local:"reader_layout",
  pluginLocal:ObservablePersistLocalStorage,
})