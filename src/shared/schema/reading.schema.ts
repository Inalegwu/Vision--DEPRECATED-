import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { issues } from "./issue.schema";

export const readingSchema = sqliteTable("reading_data", {
  id: text("id").unique().notNull().primaryKey(),
  totalPages: integer("total_pages"),
  currentPage: integer("current_page"),
  issueId: text("issue_id"),
});

export const readingIssue = relations(readingSchema, ({ one }) => ({
  issueReading: one(issues, {
    fields: [readingSchema.issueId],
    references: [issues.id],
  }),
}));
