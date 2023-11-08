import { v4 } from "uuid";

export function generateUUID() {
  const uuid = v4();

  return uuid;
}
