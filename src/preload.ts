import { exposeElectronTRPC } from "electron-trpc/main";

console.log("Fuck yeah I'm mounted up");

// expose electron-trpc link to the window object
// once the process is loaded
process.once("loaded", async () => {
  exposeElectronTRPC();
});
