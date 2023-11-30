import { ArcFile } from "node-unrar-js";
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

// implemented based on
// https://github.com/codedread/kthoom/blob/master/code/comics/comic-book-page-sorter.js
// I'll have to try and understand this regex on my own , so I'll be able to extend this code if
// necessary
export function sortPages(a: ArcFile<Uint8Array>, b: ArcFile<Uint8Array>) {
  // Strip off file extension.
  const aName = a.fileHeader.name.replace(/\.[^/.]+$/, "");
  const bName = b.fileHeader.name.replace(/\.[^/.]+$/, "");
  // If we found numbers at the end of the filenames ...
  const aMatch = aName.match(/(\d+)$/g);
  const bMatch = bName.match(/(\d+)$/g);

  if (aMatch && aMatch.length === 1 && bMatch && bMatch.length === 1) {
    const aPrefix = aName.substring(0, aName.length - aMatch[0].length);
    const bPrefix = aName.substring(0, bName.length - bMatch[0].length);

    if (aPrefix.toLocaleLowerCase() === bPrefix.toLocaleLowerCase()) {
      return parseInt(aMatch[0], 10) > parseInt(bMatch[0], 10) ? 1 : -1;
    }
  }

  return a.fileHeader.name > b.fileHeader.name ? 1 : -1;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

// TODO implement a debounce function
// for events
export function debounce(event: any) {
  setTimeout(() => {}, 4000);
}
