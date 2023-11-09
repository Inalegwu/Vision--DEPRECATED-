import { BrowserWindow } from "electron";
import { db } from "./storage";
import { inferAsyncReturnType } from "@trpc/server";

// Returns the context object to
// to attach to trpc ctx
// the database connection,browser window and
// eventually session data will live here for use
// in all procedures , public and private
export async function createContext() {
  const BrowerWindow = BrowserWindow.getFocusedWindow();

  return {
    db,
    window: BrowerWindow,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

