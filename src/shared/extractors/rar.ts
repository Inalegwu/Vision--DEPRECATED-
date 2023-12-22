import { readFileSync } from "fs";
import { createExtractorFromData } from "node-unrar-js";
import { sortPages } from "../utils";

// Handles parsing and extraction of .cbr files
export default async function RarExtractor(filePath: string) {
  // the createExtractorFromData function accepts the wasm
  // binary as a buffer read from the device
  const wasmBinary = readFileSync(
    "node_modules/node-unrar-js/dist/js/unrar.wasm",
  );

  const file = readFileSync(filePath);

  const data = Uint8Array.from(file).buffer;

  const extractor = await createExtractorFromData({
    data,
    wasmBinary,
  });

  const list = extractor.getFileList();
  const fileHeaders = [...list.fileHeaders];

  const files = fileHeaders.map((v) => v.name);
  const extracted = extractor.extract({ files });

  const extractedFiles = [...extracted.files];

  const sortedFiles = extractedFiles.sort((a, b) =>
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
