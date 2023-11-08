import { db } from "./storage";
import { inferAsyncReturnType } from "@trpc/server";

// Returns the context object to
// to attach to trpc ctx
// the database connection and
// eventually session data will live here for use
// in all procedures , public and private
export async function createContext() {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

