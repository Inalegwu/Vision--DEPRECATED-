// handles extraction of .cbz files
import { sortZipPages } from "@shared/utils";
import Zip from "adm-zip";
import * as fs from "fs";

export default async function ZipExtractor(filePath: string) {
  const file = fs.readFileSync(filePath);
  const zip = new Zip(file);

  const entries = zip.getEntries();

  const sortedEntries = entries
    .sort(sortZipPages)
    .map((v) => ({ name: v.name, data: v.getData() }));

  const metaDataFile = sortedEntries.find((v) => v.name.includes("xml"));
  const sortedFilesWithoutMetaData = sortedEntries.filter(
    (v) => !v.name.includes("xml")
  );

  return {
    metaDataFile,
    sortedFiles: sortedFilesWithoutMetaData,
  };
}
