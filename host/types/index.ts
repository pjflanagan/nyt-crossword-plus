import moment from "moment";

export type TimeEntry = {
  username: string;
  date: string;
  time: number;
};

// Stats

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

export type GraphType = {
  date: string;
  averageTime: number;
  bestTime: number;
  bestTimeUsername: string;
}

// Page State

export type Filter = { // FilterState
  excludeMidis: boolean;
  duration: 3 | 7 | 31 | false;
};
