import request, { UriOptions, RequestCallback, Response } from "request";
import initLogger from "./logger";
import JSONbig from "json-bigint";
import { ENVIRONMENT } from "./secrets";
const [logDebug, logError] = [
  initLogger("[request.ts]")("debug"),
  initLogger("[request.ts]")("error"),
];
const monitorRequest = (
  option: UriOptions,
  callback: RequestCallback
): void => {
  logDebug("Request:");
  logDebug(option);
  if (
    (ENVIRONMENT === "production" && process.argv.indexOf("debug") === -1) ||
    ENVIRONMENT !== "production"
  ) {
    request(option, (error: unknown, response: Response, body: unknown) => {
      if (error) {
        logError("Error:");
        if (body) {
          logError(JSONbig.parse(body));
        }
      }
      if (response) {
        logDebug("Response:");
        if (body) {
          logDebug(JSONbig.parse(body));
        }
      }
      callback(error, response, body);
    });
  }
};
export default monitorRequest;
