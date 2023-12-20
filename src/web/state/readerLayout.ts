import { ReaderLayout } from "@shared/types";
import { observable } from "@legendapp/state";

type ReaderLayoutState = {
  layout: ReaderLayout;
};

export const readerLayout = observable<ReaderLayoutState>({
  layout: "SinglePage",
});
