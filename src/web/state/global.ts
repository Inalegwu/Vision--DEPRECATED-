import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { GlobalState } from "@shared/types";

// the global application state
// this keeps track of certain ui changes and
// other state that will be tracked and possibly changed
// in multiple places
export const globalState$ = observable<GlobalState>({
  // tracks the applications identification
  // that allows for certain features , current and upcoming
  // and tracks whether or not this is the users first
  // launch , which defaults to false and is changed
  // when the user finally launches the app and meets the
  // first launch page
  appState: {
    firstLaunch: true,
    applicationId: undefined,
  },
  // application ui state
  // this defines how ui elements will behave
  // according to user setting some
  // default behaviours
  uiState: {
    distractionFreeMode: false,
    ambientBackground: false,
    readerLayout: "SinglePage",
    // currently contemplating having a color
    // mode option , although implementing it into the ui
    // will have to be when I'm migrating the kuma-ui
    // this will also be in consideration of implementing
    // multiple ui themes , like the Sofa app
    colorMode: "dark",
    // defaults to bottom center of the screen
    // based of the windows width and height
    navPos: {
      x: window.outerWidth * 0.45,
      y: window.outerHeight * 0.92,
    },
  },
});

// persist the global state
// in local storage
// so the user doesn't keep having new application id's
// and so they don't see the first launch page
// every time they open the app
persistObservable(globalState$, {
  local: "global_state",
  pluginLocal: ObservablePersistLocalStorage,
});
