import { sortPages } from "@shared/utils";
import { readFileSync } from "fs";
import { createExtractorFromData } from "node-unrar-js";

// Handles parsing and extraction of .cbr files
export default async function RarExtractor(filePath: string) {
  // the createExtractorFromData function accepts the wasm
  // binary as a buffer read from the device
  const wasmBinary = readFileSync(
    "node_modules/node-unrar-js/dist/js/unrar.wasm",
  );

  // read the file buffer
  const file = readFileSync(filePath);

  // convert the data from reading the file into
  // the format the createExtractorFromData
  // function need i.e : Uint8Array
  const data = Uint8Array.from(file).buffer;

  // instantiate the extractor
  const extractor = await createExtractorFromData({
    data,
    wasmBinary,
  });

  // load the file list into memory
  const list = extractor.getFileList();

  // extract files
  const extracted = extractor.extract({
    files: [...list.fileHeaders].map((v) => v.name),
  });

  // sort the files based on the sort files
  // function defined in utils
  const sortedFiles = [...extracted.files].sort((a, b) =>
    sortPages(a.fileHeader.name, b.fileHeader.name),
  );

  // extract the metadata file separately
  const metaDataFile = sortedFiles.find((v) =>
    v.fileHeader.name.includes("xml"),
  );

  // exclude the metadata file from the sorted
  // files so I don't have to worry about accidentally
  // encoding it
  const sortedFilesWithoutMetaData = sortedFiles.filter(
    (v) => !v.fileHeader.name.includes("xml"),
  );

  return {
    metaDataFile,
    sortedFiles: sortedFilesWithoutMetaData,
  };
}
