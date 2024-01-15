import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { collections } from "./collection.schema";
import { pages } from "./page.schema";
import { readingSchema } from "./reading.schema";

export const issues = sqliteTable(
  "issues",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    dateCreated: integer("date_created").default(Date.now()),
    thumbnailUrl: text("thumbnail_url").notNull(),
    collectionId: text("collection_id"),
    savedReadingId: text("reading_id"),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("issue_id_idx").on(table.id),
    };
  },
);

export const pageIssueRelation = relations(issues, ({ many }) => ({
  pages: many(pages),
}));

export const issueCollectionRelation = relations(issues, ({ one }) => ({
  collection: one(collections, {
    fields: [issues.collectionId],
    references: [collections.id],
  }),
}));

export const issueReadingRelation = relations(issues, ({ one }) => ({
  readingData: one(readingSchema, {
    fields: [issues.savedReadingId],
    references: [readingSchema.id],
  }),
}));
