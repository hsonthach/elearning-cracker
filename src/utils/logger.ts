import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import rootPath from "./rootPath";
import { ENVIRONMENT } from "./secrets";
type logLevel = "info" | "error" | "debug";

const logPath =
  ENVIRONMENT !== "production" || process.argv.indexOf("debug") !== -1
    ? rootPath.concat("/../log")
    : rootPath.concat("/log");

const createOption = (
  fileName: logLevel | "combine",
  silent: boolean = true
): winston.LoggerOptions => ({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] [${info.level}] :  ${JSON.stringify(info.message)}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
      silent,
    }),
    new winstonDailyRotateFile({
      filename: logPath + `/%DATE%/${fileName}.log`,
      datePattern: "YYYY-MM-DD",
    }),
  ],
});

const logger = {
  debug: winston.createLogger(createOption("debug", false)),
  error: winston.createLogger(createOption("error", false)),
  info: winston.createLogger(createOption("info", true)),
  comebine: winston.createLogger(createOption("combine", true)),
};

logger.debug.debug("Initilize logger");

let currentModuleName = "";
const initLogger = (moduleName: string) => (level: logLevel = "debug") => (
  message: unknown
): void => {
  if (moduleName !== currentModuleName) {
    currentModuleName = moduleName;
    logger[level][level](moduleName);
  }
  logger[level][level](message);
  logger.comebine.info(message);
};
export default initLogger;
