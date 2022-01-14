import moment from "moment";

const HOUR_IN_S = 60 * 60;

const prefix0 = (num: string): string => {
  return (num.length === 1) ? `0${num}` : num;
}

export const formatTimeMMSS = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${prefix0(`${seconds}`)}`;
}

export const formatTimeHHMM = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / HOUR_IN_S);
  const minutes = Math.floor(timeInSeconds % HOUR_IN_S / 60);
  return `${hours}h:${prefix0(`${minutes}`)}m`;
}

export const formatDBDate = (date: string): moment.Moment => {
  return moment(date).utcOffset(0);
}

export const formatDate = (date: string): string => {
  return formatDBDate(date).format('MMM D');
}