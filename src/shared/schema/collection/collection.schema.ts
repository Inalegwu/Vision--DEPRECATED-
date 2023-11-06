import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { issues } from "../issue/issue.schema";

export const collections = sqliteTable(
  "collections",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    dateCreated: integer("date_created").default(Date.now()),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
    };
  }
);

export const issueCollectionRelation = relations(collections, ({ many }) => ({
  issues: many(issues),
}));

