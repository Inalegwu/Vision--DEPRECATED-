import { db } from "../../storage";
import { InsertPage } from "../../types";
import { pages } from "./page.schema";

export async function insertPage(values: InsertPage) {
  try {
    await db.insert(pages).values(values);
  } catch (e) {
    throw e;
  }
}
