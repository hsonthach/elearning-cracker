import { CheckFunc } from "../types/global";
// Continue multiply dramatically until CheckFunc false, then slowly increase till it false again
const slowStart = (
  check: CheckFunc<number>,
  initialVal: number,
  multiply: number = 2,
  increment: number = 1
): number => {
  let tempVal = initialVal;
  while (check(tempVal)) {
    tempVal *= multiply;
  }
  tempVal /= multiply;
  while (check(tempVal)) {
    tempVal += increment;
  }
  return tempVal;
};

export default slowStart;
