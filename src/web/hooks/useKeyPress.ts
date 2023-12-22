export default function useKeyPress(fn: (e: KeyboardEvent) => void) {
  window.addEventListener("keypress", fn);
}
