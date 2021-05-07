import puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { Browser } from "puppeteer";
import { Questions } from "./types/global";
import { readJson, writeJson } from "./utils/json";
import PuppeteerUtility from "./utils/PuppeteerUtility";
import rootPath from "./utils/rootPath";
const USERNAME_SELECTOR = "#username";
const PASSWORD_SELECTOR = "#password";
const LOGIN_SELECTOR = `[name="submit"]`;
const ENTER_EXAM_SELECTOR = `[type="submit"]`;
const DELAY_TIME = 3000;

const USER_NAME = "son.thach011011";
const PASSWORD = "bigboobz";

class ElearningCracker {
  private browser: Browser;

  private page: Page;

  private examURL: string;

  private questions: Questions;

  private examResultURL: string;

  private checkingTitle: string;

  private checkingAnswer: string;

  private puppeteerUtils: PuppeteerUtility;

  private questionPath: string;

  private backupPath: string;

  constructor(
    id: number,
    private numPage: number,
    private userName: string,
    private password: string
  ) {
    this.questionPath = rootPath.concat(`/assets/${id}.json`);
    this.backupPath = rootPath.concat(`/assets/${id}-backup.json`);
    this.questions = readJson(this.questionPath, {});
    this.examResultURL = `http://e-learning.hcmut.edu.vn/mod/quiz/view.php?id=${id}`;
  }

  private gotoExamPage = async (pageNum: number) => {
    const examPage = this.examURL + `&page=${pageNum}`;
    await this.puppeteerUtils.gotoTillSucess(examPage);
  };

  private enterExam = async () => {
    await this.puppeteerUtils.gotoTillSucess(this.examResultURL);
    await this.puppeteerUtils.clickTillSuccess(ENTER_EXAM_SELECTOR);
    this.examURL = await this.getCurrentURL();
  };

  private getQuestionsByPage = async (pageNum: number): Promise<Questions> => {
    await this.gotoExamPage(pageNum);
    return await this.puppeteerUtils.evaluateTillSuccess(() => {
      const pageQuestions: Questions = {};
      const titleNodes = Array.from(
        document.querySelectorAll('[id^="question"] .content .qtext')
      ).map((el) => ({
        title: el.textContent,
        node: el.parentNode.parentNode,
      }));
      for (let i = 0; i < titleNodes.length; i++) {
        const titleNode = titleNodes[i];
        const answers = Array.from(
          titleNode.node.querySelectorAll('.answer [class^="r"]')
        ).map((el) => el.textContent.slice(3));
        pageQuestions[titleNode.title] = {
          possibleAnswers: answers,
        };
      }
      return pageQuestions;
    });
  };

  private fillAnswerByPage = async (pageNum: number) => {
    await this.gotoExamPage(pageNum);
    await this.puppeteerUtils.evaluateTillSuccess(
      (questions: Questions) => {
        const titleNodes = Array.from(
          document.querySelectorAll('[id^="question"] .content .qtext')
        ).map((el) => ({
          title: el.textContent,
          node: el.parentNode.parentNode,
        }));
        for (let i = 0; i < titleNodes.length; i++) {
          const titleNode = titleNodes[i];
          if (questions[titleNode.title]) {
            // Get index  0,1,2,3
            const answers = Array.from(
              titleNode.node.querySelectorAll('.answer [class^="r"]')
            ).map((el) => el.textContent.slice(3));
            const index = answers.findIndex(
              (answer) =>
                questions[titleNode.title].possibleAnswers[0] === answer
            );
            (titleNode.node.querySelector(
              `[class^='r']:nth-child(${index + 1})>input`
            ) as HTMLElement).click();
          }
        }
      },
      [this.questions]
    );
    // Submit answer
    await this.puppeteerUtils.clickTillSuccess(`[type="submit"]`);
  };

  private fillAnswer = async () => {
    for (let i = 0; i < this.numPage; i++) {
      await this.fillAnswerByPage(i);
    }
    await this.submitAnswer();
  };

  /**
   * Pick the unanswered title
   */
  private pickTitle = async () => {
    for (let i = 0; i < this.numPage; i++) {
      const questions = await this.getQuestionsByPage(i);
      const titles = Object.keys(questions);
      for (let j = 0; j < titles.length; j++) {
        const title = titles[j];
        if (!this.questions[title]) {
          this.questions[title] = {
            possibleAnswers: questions[title].possibleAnswers,
          };
          return title;
        }
        if (this.questions[title].possibleAnswers.length > 1) return title;
      }
    }
    return null;
  };
  private getCurrentURL = async () => {
    return await this.puppeteerUtils.evaluateTillSuccess(() => {
      return window.location.href;
    });
  };

  private submitAnswer = async () => {
    // Submit the answer
    await this.puppeteerUtils.clickTillSuccess(`[type="submit"]`);
    await this.puppeteerUtils.gotoTillSucess(this.examURL + "&page=100");
    await this.puppeteerUtils.clickTillSuccess(`[type="submit"]:nth-child(2)`);
    await this.puppeteerUtils.evaluateTillSuccess(() => {
      (document.querySelectorAll('[type="submit"]')[1] as HTMLElement).click();
    });
    await this.puppeteerUtils.clickTillSuccess(".confirmation-buttons >.btn");
  };

  private checkIsCorrectAnswer = async () => {
    // Check the answer is right or wrong
    return await this.puppeteerUtils.evaluateTillSuccess(() => {
      const point = parseFloat(
        document.querySelector(".lastrow .c2").textContent
      );
      if (point > 0) {
        return true;
      }
      return false;
    });
  };

  private markAnswer = async () => {
    // Pick the the node that have the title and answer
    await this.puppeteerUtils.evaluateTillSuccess(
      (checkingAnswer, checkingTitle) => {
        const titleNodes = Array.from(
          document.querySelectorAll('[id^="question"] .content .qtext')
        ).map((el) => ({
          title: el.textContent,
          node: el.parentNode.parentNode,
        }));
        for (let i = 0; i < titleNodes.length; i++) {
          const titleNode = titleNodes[i];
          if (titleNode.title === checkingTitle) {
            // Get index  0,1,2,3
            const answers = Array.from(
              titleNode.node.querySelectorAll('.answer [class^="r"]')
            ).map((el) => el.textContent.slice(3));

            // TODO: Handle index == -1
            let index = answers.findIndex(
              (answer) => checkingAnswer === answer
            );
            if (index === -1) index = 0;

            // Check the answer
            (titleNode.node.querySelector(
              `[class^='r']:nth-child(${index + 1})>input`
            ) as HTMLElement).click();
          }
        }
      },
      [this.checkingAnswer, this.checkingTitle]
    );

    // Submit the answer
    await this.submitAnswer();

    // Check the answer is right or wrong
    const isCorrect: boolean = await this.checkIsCorrectAnswer();
    if (isCorrect) {
      this.questions[this.checkingTitle] = {
        possibleAnswers: [this.checkingAnswer],
      };
    }
  };

  private enterExamAndGetTitle = async () => {
    await this.enterExam();

    this.checkingTitle = await this.pickTitle();

    if (this.checkingTitle) {
      this.checkingAnswer = this.questions[
        this.checkingTitle
      ].possibleAnswers.pop();
    }
  };

  private authenticate = async () => {
    const loginPanelURL =
      "https://sso.hcmut.edu.vn/cas/login?service=http%3A%2F%2Fe-learning.hcmut.edu.vn%2Flogin%2Findex.php%3FauthCAS%3DCAS";
    await this.puppeteerUtils.gotoTillSucess(loginPanelURL);
    await this.page.type(USERNAME_SELECTOR, this.userName);
    await this.page.type(PASSWORD_SELECTOR, this.password);
    await this.puppeteerUtils.clickTillSuccess(LOGIN_SELECTOR);
    await this.page.waitFor(DELAY_TIME);
  };

  execute = async () => {
    writeJson(this.backupPath, this.questions);

    this.browser = await puppeteer.launch({
      headless: false,
    });
    this.page = await this.browser.newPage();
    this.puppeteerUtils = new PuppeteerUtility(this.page);

    await this.authenticate();

    await this.enterExamAndGetTitle();

    while (this.checkingTitle) {
      await this.markAnswer();
      // Record questions
      writeJson(this.questionPath, this.questions);
      console.log(this.questions);
      await this.enterExamAndGetTitle();
    }

    await this.enterExam();
    await this.fillAnswer();
  };
}

const main = async () => {
  [
    {
      id: 502476,
      numPage: 2,
    },
  ].map(async (el) => {
    await new ElearningCracker(
      el.id,
      el.numPage,
      USER_NAME,
      PASSWORD
    ).execute();
  });
};

main();
