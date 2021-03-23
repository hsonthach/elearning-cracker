import moment from "moment";
export const lt = (timeA: Date, timeB: Date, value: number): boolean => {
  return timeA.getTime() - timeB.getTime() < value;
};
export const gt = (timeA: Date, timeB: Date, value: number): boolean => {
  return timeA.getTime() - timeB.getTime() > value;
};

export const sencondToHour = (second: number): string =>
  moment("2000-01-01 00:00:00").add(second, "seconds").format("HH:mm:ss");

export const dateFromNow = (second: number): string =>
  moment({}).seconds(second).format("YYYY-DD-MM HH:mm:ss");
