export default function useKeyPress(callback: (e: KeyboardEvent) => void) {
  window.addEventListener("keypress", callback);

  return window.removeEventListener("keypress", callback);
}
