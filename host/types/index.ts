import moment from "moment";

export type TimeEntry = {
  username: string;
  date: string;
  time: number;
};

// Stats

export type DateTimeEntryMap = {
  [key: string]: TimeEntry[],
}

export type PlacedEntry = TimeEntry & {
  place: number;
  moment: moment.Moment;
  dayScore: number;
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
  }
}

export type TableRow = UserStat & {
  key: string;
}

export type GraphDateEntry = {
  date: string;
  averageTime: number;
  medianTime: number;
  bestTime: number;
  bestTimeUsernames: string[];
  currentUsernameTime: number | undefined;
  currentUsernamePlace: number | undefined;
}

export type Graph = GraphDateEntry[];

// Page State

export type Filter = { // FilterState
  excludeMidis: boolean;
  duration: 3 | 8 | 31 | false;
};
