import { useEffect } from "react";

export default function useWindow<K extends keyof WindowEventMap>(
  eventType: K,
  listener: (this: Window, ev: WindowEventMap[K]) => unknown,
) {
  useEffect(() => {
    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, []);
}
