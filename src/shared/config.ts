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
      // It's not a network request is it
      // so it's safe to say that things in the database won't be changing that often
      // if i need the cache to change , I can always useQueryClient.invalidateQueries()
      cacheTime: Infinity,
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
      // Same goes for here
      cacheTime: Infinity,
      networkMode: "always",
      retry: 1,
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
