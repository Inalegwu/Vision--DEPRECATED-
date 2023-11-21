import { QueryClient } from "@tanstack/react-query";
import { TRPCClientError, createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "electron-trpc/renderer";
import { AppRouter } from "./routers/_app";
import toast from "react-hot-toast";
import { TRPCError } from "@trpc/server";

export const trpcReact = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 60 * 60 * 24,
      networkMode: "always",
      retry: 0,
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          console.log(err.cause);
          toast.error(err.message);
        } else {
          console.log(err);
        }
      },
    },
    mutations: {
      cacheTime: 60 * 60 * 24,
      networkMode: "always",
      retry: 0,
      onError: (err) => {
        if (err instanceof TRPCClientError || err instanceof TRPCError) {
          console.log(err.cause);
          toast.error(err.message);
        } else {
          console.log(err);
          toast.error("Something Went wrong");
        }
      },
    },
  },
});

export const trpcClient = trpcReact.createClient({
  links: [ipcLink()],
});
