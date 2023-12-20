import { sortPages } from "@shared/utils";
import Zip from "adm-zip";
import * as fs from "fs";

// handles extraction of .cbz files
export default async function ZipExtractor(filePath: string) {
  try {
    const file = fs.readFileSync(filePath);
    const zip = new Zip(file);

    const entries = zip.getEntries();

    const sortedEntries = entries
      .sort((a, b) => sortPages(a.name, b.name))
      .map((v) => ({ name: v.name, data: v.getData(), isDir: v.isDirectory }));

    const metaDataFile = sortedEntries.find((v) => v.name.includes("xml"));
    const sortedFilesWithoutMetaData = sortedEntries.filter(
      (v) => !v.name.includes("xml"),
    );

    return {
      metaDataFile,
      sortedFiles: sortedFilesWithoutMetaData,
    };
  } catch (e) {
    throw e;
  }
}
