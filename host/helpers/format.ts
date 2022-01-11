import moment from "moment";

const prefix0 = (num: string): string => {
  return (num.length === 1) ? `0${num}` : num;
}

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${prefix0(`${seconds}`)}`;
}

export const formatDBDate = (date: string): moment.Moment => {
  return moment(date).utcOffset(0);
}

export const formatDate = (date: string): string => {
  return formatDBDate(date).format('MMM D');
}