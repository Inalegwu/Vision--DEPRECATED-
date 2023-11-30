import { ApplicationState } from "@src/shared/types";
import { atomWithStorage } from "jotai/utils";

export const applicationState = atomWithStorage<ApplicationState>(
  "application_state",
  {
    firstLaunch: true,
    applicationId: undefined,
  }
);
