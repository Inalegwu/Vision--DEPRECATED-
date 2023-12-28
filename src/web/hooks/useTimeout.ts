import { useEffect } from "react";

// an automatically cleaned
// up timeout hook
// inspired by usehook-ts react library
// many of those function are easy enough to
// implement and I don't need a whole library to
// do what they do
export default function useTimeout(fn: () => unknown, ms: number) {
  useEffect(() => {
    const t = setTimeout(fn, ms);

    return () => {
      clearTimeout(t);
    };
  }, [fn, ms]);
}
