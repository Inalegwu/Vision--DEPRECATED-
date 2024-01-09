import { debounce } from "@src/shared/utils";
import { useEffect, useMemo } from "react";

/**
 *
 * Returns a debounced event handler and
 * handles automatic teardown of created
 * handler
 *
 * Hook Interface of debounce function for
 * React frontend
 *
 */
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
  useEffect(() => () => tearDown(), [tearDown]);

  // expose only the debounce function to the user to attach to
  // event handlers
  return debouncedFn;
};

export default useDebounce;
