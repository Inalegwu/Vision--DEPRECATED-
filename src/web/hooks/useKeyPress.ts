/**
 *
 * Attaches a "keypress" listener
 * to window and accepts the handler
 * callback
 *
 */
export default function useKeyPress(callback: (e: KeyboardEvent) => void) {
  window.addEventListener("keypress", callback);
}
