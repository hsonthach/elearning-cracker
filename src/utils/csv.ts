import * as fs from "fs";
import * as csv from "fast-csv";
import initLogger from "./logger";
const { logDebug } = initLogger("[csv.ts]");
import { Struct } from "../types/global";
// pathName is path from nodejs root path
export function appendCSV(
  pathName: string,
  data: Struct[],
  haveHeader: boolean = false,
  finishCallback: () => void = null
): void {
  const ws = fs.createWriteStream(pathName, { flags: "a" });
  if (finishCallback)
    csv
      .write(data, { headers: haveHeader, includeEndRowDelimiter: true })
      .pipe(ws)
      .on("close", finishCallback);
  else
    csv
      .write(data, { headers: haveHeader, includeEndRowDelimiter: true })
      .pipe(ws);
}

export function readCSV<T>(
  pathName: string,
  rowReader: (data: T[], row: string[]) => T,
  finishCallback: (data: T[]) => void,
  data: T[],
  haveHeader: boolean = false
): void {
  logDebug("Reading data ...");
  fs.createReadStream(pathName)
    .pipe(csv.parse({ headers: haveHeader }))
    .on("error", (error) => console.error(error))
    .on("data", (row: string[]) => {
      const record = rowReader(data, row);
      if (record) data.push(record);
    })
    .on("end", (rowCount: number) => {
      logDebug(`Parsed ${rowCount} rows`);
      finishCallback(data);
    });
}

export const writeCSV = (
  pathName: string,
  data: Struct[],
  haveHeader: boolean = false,
  finishCallback: () => void = null
): void => {
  const ws = fs.createWriteStream(pathName, { flags: "w" });
  if (finishCallback)
    csv
      .write(data, { headers: haveHeader, includeEndRowDelimiter: true })
      .pipe(ws)
      .on("close", finishCallback);
  else
    csv
      .write(data, { headers: haveHeader, includeEndRowDelimiter: true })
      .pipe(ws);
};

export const filterCSV = <T extends Struct>(
  inputPath: string,
  outputPath: string,
  convertFunc: (data: T[], row: string[]) => T | null,
  haveHeader: boolean = false,
  data: T[] = [],
  finishCallback: () => void = null
): void => {
  logDebug("Reading data ...");
  fs.createReadStream(inputPath)
    .pipe(csv.parse({ headers: haveHeader }))
    .on("error", (error) => console.error(error))
    .on("data", (row: string[]) => {
      const record: T = convertFunc(data, row);
      //if (record) logDebug(record);
      if (record) data.push(record);
    })
    .on("end", (rowCount: number) => {
      logDebug(`Row row count: ${rowCount} rows`);
      logDebug(`New row count: ${data.length} rows`);
      if (finishCallback)
        return writeCSV(outputPath, data, haveHeader, finishCallback);
      writeCSV(outputPath, data, haveHeader);
    });
};
