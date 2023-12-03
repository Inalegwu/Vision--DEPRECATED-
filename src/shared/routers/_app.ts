import pkg from "../../../package.json";
import { issueRouter } from "@shared/routers/issue";
import { windowRouter } from "@shared/routers/window";
import { libraryRouter } from "@shared/routers/library";
import { publicProcedure, router } from "@src/trpc";

export const appRouter = router({
  window: windowRouter,
  library: libraryRouter,
  issue: issueRouter,
  version: publicProcedure.query(() => {
    return pkg.version;
  }),
});

export type AppRouter = typeof appRouter;
