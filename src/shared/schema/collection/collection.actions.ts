import { db } from "../../storage";
import { collections } from "./collection.schema";

export async function allCollections() {
  const collections = await db.query.collections.findMany({
    with: { issues: true },
  });

  return collections.map((v) => ({ name: v.name, id: v.id, issues: v.issues }));
}

export async function getColectionById(id: string) {
  const collection = await db.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, id),
    with: { issues: true },
  });

  if (!collection) {
    return {
      status: false,
    };
  }

  return {
    status: true,
    collection,
  };
}

export async function addIssueToCollection(
  issueId: string,
  collectionId: string
) {
  //TODO
}

export async function removeIssueFromCollection(
  issueId: string,
  collectionId: string
) {
  //TODO
}
