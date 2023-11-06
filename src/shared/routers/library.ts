import { app, dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import * as fs from "fs/promises";
import { ArchiveReader, libarchiveWasm } from "libarchive-wasm";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async () => {
    const result = await dialog.showOpenDialog({
      title: "Select Issue",
      defaultPath: app.getPath("downloads"),
      buttonLabel: "Add To Library",
      properties: ["openFile"],
    });

    if (result.canceled) {
      return {
        status: false,
        reason: "CANCELLED",
      };
    }

    console.log(result.filePaths);

    const file = await fs.readFile(result.filePaths[0]);
    const mod = await libarchiveWasm();
    const reader = new ArchiveReader(mod, new Int8Array(file));

    for (const result of reader.entries()) {
      console.log(result);
    }
  }),
});

