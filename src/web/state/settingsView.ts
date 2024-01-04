import { observable } from "@legendapp/state";

// determines whether or not the settings ui
// is visible. It is defined here to ensure
// that it can be triggered from one section of
// the app and can be observed in another section
// in this case , the true state is triggered by the
// navigation bar and the false state by the settings
// view itself
export const settingsView = observable<boolean>(false);
