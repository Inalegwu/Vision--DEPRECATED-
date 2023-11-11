import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { pages } from "../page/page.schema";

export const issues = sqliteTable(
  "issues",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    collectionId: text("collection_id"),
    dateCreated: integer("date_created").default(Date.now()),
    thumbnailUrl: text("thumbnail_url").notNull(),
    currentlyReading: integer("currently_reading", { mode: "boolean" }),
  },
  (table) => {
    return {
      nameIdx: index("issue_name_idx").on(table.name),
      collectionIdx: uniqueIndex("collection_idx").on(table.collectionId),
    };
  }
);

export const pageIssueRelation = relations(issues, ({ many }) => ({
  pages: many(pages, { relationName: "pages" }),
}));

