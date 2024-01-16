import { inferAsyncReturnType } from "@trpc/server";
import { BrowserWindow, app } from "electron";
import { db } from "./storage";

export async function createContext() {
  const BrowerWindow = BrowserWindow.getFocusedWindow();

  return {
    db,
    window: BrowerWindow,
    app,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
