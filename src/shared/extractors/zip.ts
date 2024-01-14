import { sortPages } from "@shared/utils";
import Zip from "adm-zip";
import { readFileSync } from "fs";

// handles extraction of .cbz files
export default async function ZipExtractor(filePath: string) {
  // read the fil
  const file = readFileSync(filePath);
  // convert into an adm-zip archive
  const zip = new Zip(file);

  const sortedEntries = zip
    .getEntries()
    .sort((a, b) => sortPages(a.name, b.name))
    // this just ensures I'm getting back only the info I need
    .map((v) => ({ name: v.name, data: v.getData(), isDir: v.isDirectory }));

  const metaDataFile = sortedEntries.find((v) => v.name.includes("xml"));

  const sortedFilesWithoutMetaData = sortedEntries.filter(
    (v) => !v.name.includes("xml"),
  );

  return {
    metaDataFile,
    sortedFiles: sortedFilesWithoutMetaData,
  };
}
