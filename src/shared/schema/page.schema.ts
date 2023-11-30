import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { issues } from "./issue.schema";

export const pages = sqliteTable(
  "pages",
  {
    id: text("id").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    issueId: text("issue_id"),
    dateCreated: integer("date_created").default(Date.now()),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
      issueIdIdx: index("page_issue_id_idx").on(table.issueId),
    };
  }
);

export const issuePageRelation = relations(pages, ({ one }) => ({
  issue: one(issues, {
    fields: [pages.issueId],
    references: [issues.id],
    relationName: "issue",
  }),
}));
