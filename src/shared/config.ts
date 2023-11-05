import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "electron-trpc/renderer";
import { AppRouter } from "./routers/_app";

export const trpcReact = createTRPCReact<AppRouter>();
export const queryClient = new QueryClient();
export const trpcClient = trpcReact.createClient({
  links: [ipcLink()],
});

