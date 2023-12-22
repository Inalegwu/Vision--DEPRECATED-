import { useEffect } from "react";

export default function useKeyPress(fn: (e: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener("keypress", fn);

    return () => {
      window.removeEventListener("keypress", fn);
    };
  });
}
