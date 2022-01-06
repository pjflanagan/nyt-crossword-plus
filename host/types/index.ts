
export type TimeEntry = {
  username: string;
  date: string;
  time: number;
};

export type DateEntries = {
  [key: string]: TimeEntry[],
}

export type PlacedEntry = TimeEntry & {
  place: number;
}

export type UserStat = {
  username: string;
  bestTime: number;
  firstPlaceFinishes: number;
  averageTime: number;
  averagePlace: number;
  gamesPlayed: number;
}

export type TimeByDateIndexDataEntry = [number, string];
export type TimeByDateIndex = {
  data: TimeByDateIndexDataEntry[];
};
