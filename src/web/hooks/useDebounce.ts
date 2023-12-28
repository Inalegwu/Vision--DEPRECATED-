import { debounce } from "@src/shared/utils";
import { useEffect, useMemo } from "react";

// return a React hook for running debounced functions
// takes in the same definition as the debounce function
// all it does is handle the automatic teardown of the debounce function
const useDebounce = <A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): ((args: A) => Promise<R>) => {
  // use useMemo to maintain the same instance of our debounce function between renders
  const [debouncedFn, tearDown] = useMemo(
    () => debounce<A, R>(fn, ms),
    [fn, ms],
  );

  // tear down our debounce function once it has been run
  useEffect(() => () => tearDown(), []);

  // expose only the debounce function to the user to attach to
  // event handlers
  return debouncedFn;
};

export default useDebounce;
