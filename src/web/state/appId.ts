import { atomWithStorage } from "jotai/utils";

export const appIdState = atomWithStorage<string>("app__id", "");
