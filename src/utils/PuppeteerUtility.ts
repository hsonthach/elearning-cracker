import puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { executePromiseTillSuccess } from "./promise";
export default class PuppeteerUtility {
  constructor(private page: Page) {}

  public clickTillSuccess = async (selector: string) => {
    await executePromiseTillSuccess(
      async () => {
        await this.page.click(selector);
      },
      1000,
      1000
    );
  };
  public evaluateTillSuccess = async (
    evaluateFunc: puppeteer.EvaluateFn,
    args: puppeteer.SerializableOrJSHandle[] = []
  ) => {
    return await executePromiseTillSuccess(
      async () => {
        return await this.page.evaluate(evaluateFunc, ...args);
      },
      1000,
      1000
    );
  };

  public gotoTillSucess = async (url: string) => {
    await this.page.goto(url, { timeout: 0 });
  };
}
