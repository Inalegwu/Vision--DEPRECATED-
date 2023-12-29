import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import * as schema from "./schema/index";

process.env = {
  STORAGE_LOCATION: `${app.getPath("appData")}/Vision/comics.db`,
};

const sqlite = new Database(process.env.STORAGE_LOCATION!, {
  /// this line has to exist because for some reason webpack can't find the .node
  /// file on it's own which is kind of a bummer...
  /// I spent 3 days , one scrapped project and an experiment project
  /// https://github.com/Inalegwu/Drizzletron
  /// to figure this out
  /// StackOverflow and Github Issues weren't much help either, But I was lucky to find this
  /// config option.
  /// ISSUE_DETAILS HERE
  /// tldr : don't remove this , take my word for it...
  // nativeBinding:
  //   "node_modules/better-sqlite3/build/Release/better_sqlite3.node",
});
export const db = drizzle(sqlite, { schema });

await migrate(db, { migrationsFolder: ".drizzle" });
