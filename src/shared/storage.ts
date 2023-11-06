import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema/index";

const sqlite = new Database("storage.db");
export const db = drizzle(sqlite, { schema });

await migrate(db, { migrationsFolder: ".drizzle" });

export const createContext = () => {
  return {
    db,
  };
};
