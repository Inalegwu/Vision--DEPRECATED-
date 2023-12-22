import { debounce } from "@src/shared/utils";
import { useEffect, useMemo } from "react";

const useDebounce = <A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): ((args: A) => Promise<R>) => {
  const [debouncedFn, tearDown] = useMemo(
    () => debounce<A, R>(fn, ms),
    [fn, ms],
  );

  useEffect(() => () => tearDown(), []);

  return debouncedFn;
};

export default useDebounce;
