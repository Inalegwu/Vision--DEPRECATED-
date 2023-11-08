import { atomWithStorage } from "jotai/utils";
import { Filter } from "../../shared/types";

export const filterState = atomWithStorage<Filter>("filter", "Issues");

