export default function useWindow<K extends keyof WindowEventMap>(
  eventType: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any
) {
  window.addEventListener(eventType, listener);
}
