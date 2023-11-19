import { config } from "../web/stitches.config";
import { issues, pages } from "./schema";
import * as Stitches from "@stitches/react";

export type ThemeState = "dark" | "light";

export type ThemeCSS = Stitches.CSS<typeof config>;

export type InsertPage = typeof pages.$inferInsert;
export type InsertIssue = typeof issues.$inferInsert;
export type Issue = typeof issues.$inferSelect;

export type ReaderLayout = "SinglePage" | "DoublePage";

export type CollectionParams = {
  collectionId: string;
};

export type IssueParams = {
  issueId: string;
};

export type Filter = "Issues" | "Collections" | "All";
