import { collections, issues, pages } from "./schema";

export type ThemeState = "dark" | "light";

export type InsertPage = typeof pages.$inferInsert;
export type InsertIssue = typeof issues.$inferInsert;
export type InsertCollection = typeof collections.$inferInsert;
