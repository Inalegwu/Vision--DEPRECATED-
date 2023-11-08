import { atomWithStorage } from "jotai/utils";

export const firstLaunchState = atomWithStorage<boolean>("first_launch", true);
