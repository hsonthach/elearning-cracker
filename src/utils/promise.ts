import initLogger from "./logger";
const { logDebug, logError } = initLogger("[request/util.ts]");

export const fakeReq = (): Promise<string> => {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      if (Math.random() > 0.9) {
        console.log("resolve comming");
        return resolve("succeed");
      }
      console.log("error comming");
      rejects("error");
    }, 500);
  });
};

export const setTimeoutPromise = async <ExpectedResponse>(
  timeout: number,
  callback: () => Promise<ExpectedResponse>
): Promise<ExpectedResponse> => {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      resolve(await callback());
    }, timeout);
  });
};

export const executePromiseTillSuccess = async <ExpectedResponse>(
  promiseCallback: () => Promise<ExpectedResponse>,
  delayForNextRequest: number,
  attempt: number,
  initAttempt: number = 0
): Promise<ExpectedResponse> => {
  logDebug("callPromiseTillSuccess");
  if (initAttempt >= attempt) return;
  try {
    const res = await promiseCallback();
    return res;
  } catch (error) {
    logDebug("Error:");
    logError(error);
    return await setTimeoutPromise(delayForNextRequest, async () => {
      return await executePromiseTillSuccess(
        promiseCallback,
        delayForNextRequest,
        attempt,
        initAttempt + 1
      );
    });
  }
};
let i = 0;
let j = 0;
export const floodRequest = (requestCall: () => Promise<unknown>): void => {
  requestCall()
    .then(() => {
      i++;
      console.log(`Server responsed ${i} request`);
    })
    .catch((err) => {
      i++;
      console.log(err.message);
    });
  j++;
  if (j === 1000) return;
  floodRequest(requestCall);
};
