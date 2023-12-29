import { sortPages } from "@shared/utils";
import Zip from "adm-zip";
import { readFileSync } from "fs";

// handles extraction of .cbz files
export default async function ZipExtractor(filePath: string) {
  // read the fil
  const file = readFileSync(filePath);
  // convert into an adm-zip archive
  const zip = new Zip(file);

  // sort the entries in the
  // zip file
  const sortedEntries = zip
    .getEntries()
    .sort((a, b) => sortPages(a.name, b.name))
    // return a format that is more similar to the rar
    // extractor format , with relevant data
    // like whether or not an entry is a directory
    // the name of the entry and the data contained in that entry
    .map((v) => ({ name: v.name, data: v.getData(), isDir: v.isDirectory }));

  // separate out the metadata file into it's own entity
  const metaDataFile = sortedEntries.find((v) => v.name.includes("xml"));

  // make sure the metaData file isn't included in the sorted files
  const sortedFilesWithoutMetaData = sortedEntries.filter(
    (v) => !v.name.includes("xml"),
  );

  return {
    metaDataFile,
    sortedFiles: sortedFilesWithoutMetaData,
  };
}
