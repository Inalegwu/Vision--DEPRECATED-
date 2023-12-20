import { exposeElectronTRPC } from "electron-trpc/main";

console.log("Fuck yeah I'm mounted up");

process.once("loaded", async () => {
  exposeElectronTRPC();
});
