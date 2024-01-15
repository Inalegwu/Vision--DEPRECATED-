import { sortPages } from "@shared/utils";
import fs from "fs";
import { createExtractorFromData } from "node-unrar-js";

export default async function RarExtractor(filePath: string) {
  const wasmBinary = fs.readFileSync(
    require.resolve("node-unrar-js/dist/js/unrar.wasm"),
  );

  const file = fs.readFileSync(filePath);

  const data = Uint8Array.from(file).buffer;

  const extractor = await createExtractorFromData({
    data,
    wasmBinary,
  });

  const list = extractor.getFileList();

  const extracted = extractor.extract({
    files: [...list.fileHeaders].map((v) => v.name),
  });

  const sortedFiles = [...extracted.files].sort((a, b) =>
    sortPages(a.fileHeader.name, b.fileHeader.name),
  );

  const metaDataFile = sortedFiles.find((v) =>
    v.fileHeader.name.includes("xml"),
  );

  const sortedFilesWithoutMetaData = sortedFiles.filter(
    (v) => !v.fileHeader.name.includes("xml"),
  );

  return {
    metaDataFile,
    sortedFiles: sortedFilesWithoutMetaData,
  };
}
