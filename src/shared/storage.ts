import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("storage.db");
const db = drizzle(sqlite);

await migrate(db, { migrationsFolder: ".drizzle" });
