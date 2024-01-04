import { useEffect } from "react";
// attach any type of event listeners to the window object
// and handle the clean up of those event listeners
// to prevent having multiple listeners firing
// when an event is triggered
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
