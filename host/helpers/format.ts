
const prefix0 = (num: string): string => {
  return (num.length === 1) ? `0${num}` : num;
}

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${prefix0(`${seconds}`)}`;
}
