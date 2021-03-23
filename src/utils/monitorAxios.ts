import axios, { AxiosRequestConfig } from "axios";
import initLogger from "./logger";
const monitorAxios = axios.create();
const { logDebug, logError } = initLogger("[axios.ts]");
monitorAxios.interceptors.request.use(
  (
    config: AxiosRequestConfig
  ): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    logDebug("Request");
    logDebug(config);
    return config;
  },
  (error) => {
    logError("Request error");
    logError(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
monitorAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    logDebug("Response");
    logDebug(response.data);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    logError("Response error");
    logError(error);
    return Promise.reject(error);
  }
);

export default monitorAxios;
