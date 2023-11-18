import { v4 } from "uuid";

export function generateUUID() {
  const uuid = v4();

  return uuid;
}

export function convertToImageUrl(buffer: ArrayBufferLike): string {
  const b64 = Buffer.from(buffer).toString("base64");
  const dataUrl = "data:image/png;base64," + b64;

  return dataUrl;
}
