import { db } from "../../storage";

export async function allCollections() {
  const collections = await db.query.collections.findMany();

  return collections.map((v) => ({ name: v.name, id: v.id }));
}
