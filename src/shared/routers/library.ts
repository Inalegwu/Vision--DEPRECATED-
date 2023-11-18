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
      };
    }

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

    console.log(extractedFiles[0]);

    const url = URL.createObjectURL(
      new Blob([extractedFiles[0].extraction?.buffer!])
    );

    console.log(url);

    return true;
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    const issues = ctx.db.query.issues.findMany({});

    return {
      issues,
    };
  }),
});
