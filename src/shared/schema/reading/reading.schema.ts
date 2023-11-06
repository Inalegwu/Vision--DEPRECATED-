import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { issues } from "../issue/issue.schema";

export const reading = sqliteTable("reading", {
  id: text("id").notNull().unique().primaryKey(),
  issueId: text("issue_id").notNull(),
});

export const readingIssueRelation = relations(reading, ({ one }) => ({
  issues: one(issues, {
    fields: [reading.issueId],
    references: [issues.id],
  }),
}));

