import { v4 } from "uuid";


// is the application in dev mode or not
export const IS_DEV = process.env.NODE_ENV === "development";


// very ,very ,very thin wrap around
// uuid/v4 to generate random uuid's
export function generateUUID() {
  const uuid = v4();

  return uuid;
}

// utility function to convert the array buffer data gotten
// from the archives extracted content to an image as b64 text which
// allows it to be rendered as a data url in the app
export function convertToImageUrl(buffer: ArrayBufferLike): string {
  const b64 = Buffer.from(buffer).toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;

  return dataUrl;
}

// sort the pages/content of an archive.in this case the pages
// this allows us ensure that pages are stored in the correct order
// the database so that reading exprience can be maintained
// this code was kindly borrowed from codedreads kthoom comic book
// reader
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

// clamp values within a range
// used when there are gesture
// related events in the application
export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

// prevent one action from being triggered multiple times
// takes in a function and a millisecond count
// the function is the event handler that will be attached to
// say a button for instance
// the ms is the time interval for an action to be fired
// once one action is loaded up , event triggers after will cause the last
// event to be discarded in favour of the new one
// see src/web/hooks/useDebounce for React hook definition
export function debounce<A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): [(args: A) => Promise<R>, () => void] {
  // declare the timeout function
  // NodeJS.Timeout , is a reference to the setTimeout function
  let timer: NodeJS.Timeout;

  // this is our debounced function , the core of this functionality
  // it returns a new promise that is resolved after the timespan passed
  // in as ms
  const debouncedFn = (args: A): Promise<R> =>
    new Promise((resolve) => {
      // if there is already a timer
      // clear it
      if (timer) {
        clearTimeout(timer);
      }

      // create a timeout to resolve
      // our function parameter after our ms time
      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

    // a global tear down function that clears the timer once
    // the function has been resolved
  const tearDown = () => clearTimeout(timer);

  // return the debounced function and the tearDown function
  // to allow for cleanup when used
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
  "You can Tell I was Built by a DC Fan , Can't You ?",
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
  const splitMeta=decodedMeta.split("\n");

  console.log(splitMeta);

  return decodedMeta;
}