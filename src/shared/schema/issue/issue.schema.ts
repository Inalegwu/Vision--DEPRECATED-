import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const issue = sqliteTable("issue", {
  id: text("id").notNull().unique(),
  name: text("name").notNull(),
});
