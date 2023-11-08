import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema/index";
import { useQueryClient } from "@tanstack/react-query";

const sqlite = new Database("storage.db", {
  /// this line has to exist because for some reason webpack can't find the .node
  /// file on it's own which is kind of a bummer...
  /// I spent 3 days , one scrapped project and an experiment project
  /// https://github.com/Inalegwu/Drizzletron
  /// to figure this out
  /// StackOverflow and Github Issues weren't much help either, But I was lucky to find this
  /// config option.
  /// tldr : don't remove this , take my word for it...
  nativeBinding:
    "node_modules/better-sqlite3/build/Release/better_sqlite3.node",
});
export const db = drizzle(sqlite, { schema });

await migrate(db, { migrationsFolder: ".drizzle" });

// Returns the context object to
// to attach to trpc ctx
// the database connection , queryClient and
// eventually session data will live here for use
// in all procedures , public and private
export function createContext() {
  const queryClient = useQueryClient();
  return {
    db,
    qc: queryClient,
  };
}

