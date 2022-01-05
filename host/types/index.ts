
export type TimeEntry = {
  username: string,
  date: string,
  time: number,
};

export type TimeByDateIndexDataEntry = [number, string];
export type TimeByDateIndex = {
  data: TimeByDateIndexDataEntry[]
};
