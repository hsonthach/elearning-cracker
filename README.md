# Elearning cracker

A cracking exam tool for [HCMUT Elearning website](http://e-learning.hcmut.edu.vn/), Allow you to pass around 80% number of questions on the website

<image src="./elearning-cracker-submit.gif" />

# Table of contents:

- [Idea](#idea)
- [How to use](#how-to-use)

# Idea

The idea is simple, the website ask us to complete N questions, allow unlimited attempt to solve the exam, then after we finish the exam, it would show the point we've got, but not allow us to view the answer. <br>
The solution is we will only submit 1/N question,.If we score > 0 point, means that we've got the right answer.If not at least we can eliminate 1 wrong answer. <br>
By repeating try and fail, we can eliminate all wrong answer. Then we can submit the right answers that we have collected so far

# How to use

- Clone the repository

```
git clone --depth=1 git@github.com:hsonthach/elearning-cracker.git
```

- Install dependencies

```
cd elearning-cracker
npm install
```

- Enter your username, password, exam id, number of pages on the exam inside the elearning-cracker.ts file

```javascript
const USER_NAME = "";
const PASSWORD = "";
```

```javascript
const main = async () => {
  [
    {
      id: 502473,
      numPage: 3,
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
```

- Start project

```bash
node ./src/elearning-cracker

```

## License

All rights reserved.
Licensed under the [MIT](LICENSE) License.
