import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import rootPath from "./rootPath";
import { ENVIRONMENT } from "./secrets";

const logPath =
  ENVIRONMENT !== "production" || process.argv.indexOf("debug") !== -1
    ? rootPath.concat("/../log")
    : rootPath.concat("/log");

const createOption = (
  level: "info" | "error" | "debug"
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
      level:
        process.env.NODE_ENV === "production" &&
        process.argv.indexOf("debug") === -1
          ? "error"
          : "debug",
      silent: level === "info" ? true : false,
    }),
    new winstonDailyRotateFile({
      filename: logPath + `/%DATE%/combine.log`,
      datePattern: "YYYY-MM-DD",
      level,
    }),
    new winstonDailyRotateFile({
      filename: logPath + `/%DATE%/${level}.log`,
      datePattern: "YYYY-MM-DD",
      level,
    }),
  ],
});

const infoLogger = winston.createLogger(createOption("info"));
const debugLogger = winston.createLogger(createOption("debug"));
const errorLogger = winston.createLogger(createOption("error"));

debugLogger.debug("Initilize logger");

let currentModuleName = "";
const initLogger = (
  moduleName: string
): {
  logDebug: (message: unknown) => void;
  logInfo: (message: unknown) => void;
  logError: (message: unknown) => void;
} => {
  const logDebug = (message: unknown): void => {
    if (moduleName !== currentModuleName) {
      currentModuleName = moduleName;
      debugLogger.debug(moduleName);
    }
    debugLogger.debug(message);
  };
  const logInfo = (message: unknown): void => {
    if (moduleName !== currentModuleName) {
      currentModuleName = moduleName;
      infoLogger.info(moduleName);
    }
    infoLogger.info(message);
  };
  const logError = (message: unknown): void => {
    if (moduleName !== currentModuleName) {
      currentModuleName = moduleName;
      errorLogger.error(moduleName);
    }
    errorLogger.error(message);
  };
  if (process.env.LOG_MODE === "silent") {
    return {
      logDebug: (message: unknown) => {
        return;
      },
      logError: (message: unknown) => {
        return;
      },
      logInfo: (message: unknown) => {
        return;
      },
    };
  }
  return {
    logDebug,
    logInfo,
    logError,
  };
};

export default initLogger;
