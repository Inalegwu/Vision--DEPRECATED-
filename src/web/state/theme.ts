import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ThemeState } from "../../shared/types";

export const themeState = atomWithStorage<ThemeState>("theme", "dark");

