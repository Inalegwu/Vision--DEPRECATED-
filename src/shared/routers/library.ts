import { dialog } from "electron";
import { publicProcedure, router } from "../../trpc";
import {
  createExtractorFromData,
  createExtractorFromFile,
} from "node-unrar-js/esm";
import path from "path";
import * as fs from "fs";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Issue",
      defaultPath: ctx.app.getPath("downloads"),
      buttonLabel: "Add To Library",
      properties: ["openFile"],
    });

    if (canceled) {
      return {
        status: false,
        url: "",
      };
    }

    // load the wasm binary of node-unrar-js from {filePath}
    const wasmBinary = fs.readFileSync(
      "node_modules/node-unrar-js/dist/js/unrar.wasm"
    );

    const buf = Uint8Array.from(fs.readFileSync(filePaths[0])).buffer;

    const extractor = await createExtractorFromData({
      data: buf,
      wasmBinary,
    });

    const list = extractor.getFileList();
    const listArcHeader = list.arcHeader;
    const fileHeaders = [...list.fileHeaders];

    const files = fileHeaders.map((v) => v.name);

    const extracted = extractor.extract({ files });
    const extractedFiles = [...extracted.files];

    const b64 = Buffer.from(extractedFiles[0].extraction?.buffer!).toString(
      "base64"
    );

    const url = "data:image/png;base64," + b64;

    return {
      url,
      status: true,
    };
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    const issues = await ctx.db.query.issues.findMany({});

    return {
      issues,
    };
  }),
});
