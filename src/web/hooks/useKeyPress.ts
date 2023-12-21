export default function useKeyPress(callback: (e: KeyboardEvent) => void) {
  window.addEventListener("keypress", callback);
  setTimeout(()=>{
    window.removeEventListener("keypress",callback);
  },3000)
}
