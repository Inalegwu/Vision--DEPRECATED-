import { useEffect } from "react";

// provides an automatically cleaned up interval function
export default function useInterval(fn: () => unknown, ms: number) {
  useEffect(() => {
    const t = setInterval(fn, ms);

    return () => {
      clearInterval(t);
    };
  }, [fn, ms]);
}
