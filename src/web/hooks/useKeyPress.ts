export default function useKeyPress(callback: (e: KeyboardEvent) => void) {
  window.addEventListener("keypress", callback);
}
