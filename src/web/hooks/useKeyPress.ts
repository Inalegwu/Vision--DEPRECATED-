import { useEffect } from "react";

// focused on attaching a keyPress listener to the window
// object and also handles the teardown of said function
// this is prefered over useWindow strictly for 
// attaching keyPress listeners
// useWindow is for more generic purposes
export default function useKeyPress(fn: (e: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener("keypress", fn);

    return () => {
      window.removeEventListener("keypress", fn);
    };
  });
}
