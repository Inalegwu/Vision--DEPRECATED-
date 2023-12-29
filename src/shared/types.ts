import * as Stitches from "@stitches/react";
import { config } from "../web/stitches.config";
import { collections, issues, pages } from "./schema";

// Backend Types
export enum Reasons {
  CANCELLED = "100",
  NONE = "000",
}

// Style Types
export type ThemeState = "dark" | "light";

export type ThemeCSS = Stitches.CSS<typeof config>;

// database types
export type InsertPage = typeof pages.$inferInsert;
export type InsertIssue = typeof issues.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Collection = typeof collections.$inferSelect;

// UI Types
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


export type Point = {
  x: number;
  y: number;
};

// State Types

export type ApplicationState = {
  // tracks whether or not
  // it's the users first time launching the app
  // to give them a sweet surprise for their first time
  firstLaunch: boolean;
  // a unique identifier for the application instance
  // useful for debugging issues, cause I can track down logs
  // with the application id to know exactly what went wrong
  applicationId: string | undefined;
  // saves the time the app was opened
  openTime?: number;
  // saves the time the app was closed
  // this can be used to determine the average time spent within
  // the application from opening to closing
  closeTime?: number;
};

// ui state
export type UIState = {
  // hides the navigation ui on the reader view and allows
  // the user focus on reading the issue
  distractionFreeMode: boolean;
  // stylised background for the reader view
  ambientBackground: boolean;
  // how would the reader like to exprience the application
  readerLayout: ReaderLayout;
  // the color mode of the application for toggling
  // light and dark mode
  colorMode:"light"|"dark"
};

// global application state
export type GlobalState = {
  appState: ApplicationState;
  uiState: UIState;
};

export type CurrentlyReading = {
  // save the id of the issue this data belongs to
  // so it can be found later
  id: string;
  // save the page the user was on when they left
  // the reader view
  page: number;
  // save the total number of pages the issue has
  // so there is no need to query the database for that
  // information
  total:number;
};

export type ReadingState = {
  currentlyReading: CurrentlyReading[];
}