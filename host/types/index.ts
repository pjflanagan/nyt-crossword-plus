import moment from "moment";

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
  moment: moment.Moment;
}

export type UserStat = {
  username: string;
  bestTime: number;
  averageTime: number;
  firstPlaceFinishes: number;
  averagePlace: number;
  gamesPlayed: number;
  power: {
    rating: number;
    index: number;
  };
}

// DB Data

export type CacheUpdate = {
  latestTimesWriteTimestamp: number;
  latestGroupReadTimestamp: number;
}

export type TimeByDateIndexDataEntry = [number, string];
export type TimeEntryData = {
  data: TimeEntry[];
};

export type TimeByDateIndex = {
  data: TimeByDateIndexDataEntry[];
};
