import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { pages } from "./page.schema";

export const issues = sqliteTable(
  "issues",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    dateCreated: integer("date_created").default(Date.now()),
    thumbnailUrl: text("thumbnail_url").notNull(),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("issue_id_idx").on(table.id),
    };
  }
);

export const pageIssueRelation = relations(issues, ({ many }) => ({
  pages: many(pages),
}));
