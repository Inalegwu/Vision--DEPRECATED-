import * as Stitches from "@stitches/react";
import { config } from "../web/stitches.config";
import { collections, issues, pages } from "./schema";

export enum Reasons {
  CANCELLED = "100",
  NONE = "000",
}

export type ThemeState = "dark" | "light";

export type ThemeCSS = Stitches.CSS<typeof config>;

export type InsertPage = typeof pages.$inferInsert;
export type InsertIssue = typeof issues.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Collection = typeof collections.$inferSelect;

export type ReaderLayout = "SinglePage" | "DoublePage" | "Manga";

export type CollectionParams = {
  collectionId: string;
};

export type IssueParams = {
  issueId: string;
};

export type LayoutProps = {
  pages?: Page[];
  activeIndex: number;
};

export type ComicMetaData = {
  Series: string;
  Language: string;
  Summary: string;
  Publisher: string;
  Notes?: string;
  Genre?: string;
  PageCount: number;
};

export type ApplicationState = {
  firstLaunch: boolean;
  applicationId: string | undefined;
};

// INCOMING
export type UIState = {
  distractionFreeMode: boolean;
};

export type Point = {
  x: number;
  y: number;
};

// global state , separate from the
// reader layout
export type GlobalState = {
  appState: ApplicationState;
  uiState: UIState;
};
