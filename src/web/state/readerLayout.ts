import { atomWithStorage } from "jotai/utils";
import { ReaderLayout } from "../../shared/types";

export const layoutAtom = atomWithStorage<ReaderLayout>(
  "reader__layout",
  "SinglePage"
);
