import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { pages } from "../page/page.schema";
import { collections } from "../collection/collection.schema";

export const issues = sqliteTable(
  "issues",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    collectionId: text("collection_id"),
    dateCreated: integer("date_created").default(Date.now()),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      collectionIdx: uniqueIndex("collection_idx").on(table.collectionId),
    };
  }
);

export const pageIssueRelation = relations(issues, ({ many }) => ({
  pages: many(pages, { relationName: "pages" }),
}));

export const collectionIssueRelation = relations(issues, ({ one }) => ({
  collection: one(collections, {
    fields: [issues.collectionId],
    references: [collections.id],
    relationName: "collection",
  }),
}));

