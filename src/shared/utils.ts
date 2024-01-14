import { v4 } from "uuid";

export const IS_DEV = process.env.NODE_ENV === "development";

export function generateUUID() {
  const uuid = v4();

  return uuid;
}

export function convertToImageUrl(buffer: ArrayBufferLike): string {
  const b64 = Buffer.from(buffer).toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;

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

export function debounce<A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): [(args: A) => Promise<R>, () => void] {
  let t: NodeJS.Timeout;

  const debouncedFn = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (t) {
        clearTimeout(t);
      }

      t = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const tearDown = () => clearTimeout(t);

  return [debouncedFn, tearDown];
}

// Random phrases to keep the loading screen
// interesting in the app , rather than using the normal
// this might take a while.
// This gives the app personality IMO, 'cause I usually like when
// apps do this
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
  "You can tell I was built by a DC fan , can't you ?",
  "I will break the Bat",
  "I actually quite liked Tom Hardy's Bane",
  "Kevin Conroy is my Batman",
  "WonderBat > Bat&Cat , Fight Me",
  "Miguel had a point though 🤷‍♂️🤔",
];

// gives a random index
// used to randomize the loading messages
// in the UI
export function getRandomIndex(min: number, max: number): number {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
}

// decode the xml metadata file that is included in the
// archive
// TODO find a way to convert this to an object that can be
// accessed as md["property"] to allow for saving things
export function decodeMetaData(data: ArrayBufferLike | Buffer) {
  const text = new TextDecoder("utf-8");
  const decodedMeta = text.decode(data);

  // TODO xml serialization
  const splitMeta = decodedMeta.split("\n");

  console.log(splitMeta);

  return decodedMeta;
}

export function upsert(array: unknown[], item: unknown) {
  // check if the element in the array
  // and the search item match
  const exists = array.find((v) => v === item);

  if (exists) {
    array.push([...array.filter((v) => v !== item), item]);
  }

  array.push([...array, item]);
}
