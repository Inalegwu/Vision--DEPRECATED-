import { inferAsyncReturnType } from "@trpc/server";
import { BrowserWindow, app } from "electron";
import { db } from "./storage";

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
    app,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
