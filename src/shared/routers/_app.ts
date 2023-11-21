import { publicProcedure, router } from "../../trpc";
import { issueRouter } from "./issue";
import { libraryRouter } from "./library";
import { windowRouter } from "./window";
import pkg from "../../../package.json";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
  issue: issueRouter,
  version: publicProcedure.query(() => {
    return pkg.version;
  }),
});

export type AppRouter = typeof appRouter;
