import fs from "fs";
export const readJson = <T>(path: string, initValue: T): T => {
  if (!fs.existsSync(path)) writeJson(path, initValue);
  const result: T = JSON.parse(fs.readFileSync(path, "utf8"));
  return result;
};

export const writeJson = (path: string, data: unknown): void => {
  fs.writeFileSync(path, JSON.stringify(data));
};
