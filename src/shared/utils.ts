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

export function sortPages(a: string, b: string) {
  // Strip off file extension.
  const aName = a.replace(/\.[^/.]+$/, "");
  const bName = b.replace(/\.[^/.]+$/, "");
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

  return a > b ? 1 : -1;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

// TODO implement a debounce function
// for events
export function debounce<K, T>(callback: (args: K) => T, args: K) {
  setTimeout(() => callback(args), 4000);
}

// loading screen phrases
export const LOADING_PHRASES = [
  "Fighting Darkseid",
  "Making sure Joker hasn't escaped again",
  "Changing Jarvis' Batteries",
  "Saying the Green Latern Oath",
  "Starching The Capes",
  "Checking up on the New Gods",
  "Making sure there aren't any new Green Lanterns",
  "Feeding Crypto",
  "Investigating Vandal Savage",
  "What is a Batman who Laughs ???",
  "Making sure the writers aren't bullying Peter",
  "Listening to JJJ's Podcast",
  "Swingin' Through Town",
  "Help!!!",
  "Rebooting the Multiverse",
  "Helping out Awesome Facial Hair Bros",
  "Nursing Jason Todd",
  "Tracking Arsenal",
  "Upgrading Oracle",
  "Jim Gordon Calling",
  "Tidying up the Hall of Justice",
  "Tidying up Avengers Tower",
  "Tidying up Titan Tower",
  "Wondering what Lex is cooking up",
  "Strolling through the Phantom Zone",
  "Azarath , Metrion , Zinthos",
  "Another !!!",
  "I AM GROOT",
  "Balanced as All Things Should Be",
  "Excelsior",
  "Alfred is the Real Batman , Trust Me",
  "Fending off Para-Demons",
];

export function getRandomIndex(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function decodeMetaData(data: ArrayBufferLike | Buffer) {
  const text = new TextDecoder("utf-8");
  const decodedMeta = text.decode(data);

  return decodedMeta;
}

// using this to render a false loading array
// until I understand Array(number).map
export const FALSE_ARRAY = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
