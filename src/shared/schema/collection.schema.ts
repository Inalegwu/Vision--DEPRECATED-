import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { issues } from "./issue.schema";

export const collections = sqliteTable(
  "collections",
  {
    id: text("id").unique().notNull(),
    name: text("name").notNull(),
  },
  (table) => ({
    idIdx: uniqueIndex("collection_id_idx").on(table.id),
  })
);

export const collectionIssues = relations(collections, ({ many }) => ({
  issues: many(issues),
}));
