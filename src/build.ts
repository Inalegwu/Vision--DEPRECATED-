import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./shared/storage";

await migrate(db, { migrationsFolder: ".drizzle" });
