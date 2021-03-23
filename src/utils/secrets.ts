import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = process.env.PORT;
