import {
  keys,
  groupBy,
  mean,
  reduce,
  sum,
  round,
  min,
  orderBy,
  flatten,
  first,
  filter,
  map,
  includes,
  each,
  maxBy
} from 'lodash';
import moment from 'moment';


import { PlacedEntry, UserStat, DateTimeEntryMap, TimeEntry, Graph, Filter } from '../types';

import { formatDate, formatDBDate } from '.';

export const getPlacedEntries = (orderedEntries: TimeEntry[]): PlacedEntry[] => {
  const placedEntries = [];
  let lastTime = 0;
  let place = 0;
  orderedEntries.forEach((entry) => {
    if (lastTime !== entry.time) {
      ++place;
    }
    lastTime = entry.time;
    placedEntries.push({
      ...entry,
      place,
      moment: formatDBDate(entry.date)
    });
  });
  return placedEntries;
}

export const getDatesLeaderboards = (dateGroups: DateTimeEntryMap): PlacedEntry[] => {
  const dates = keys(dateGroups);
  const placedDates = dates.map(date => getPlacedEntries(dateGroups[date]));
  return flatten(placedDates);
};

export const makeFilteredEntries = (filterParams: Filter, placedEntries: PlacedEntry[]) => {
  let filteredEntries = placedEntries;
  if (filterParams.excludeMidis) {
    filteredEntries = filter(filteredEntries, (entry) => entry.moment.format('dddd') !== 'Saturday');
  }
  if (filterParams.duration) {
    const day = moment().subtract(filterParams.duration, 'day');
    filteredEntries = filter(filteredEntries, (entry) => entry.moment.isAfter(day));
  }
  return filteredEntries;
}

export const makeGraph = (placedEntries: PlacedEntry[]): Graph => {
  const dateGroups = groupBy(placedEntries, 'date');
  const dates = keys(dateGroups).sort((a, b) => moment(a).diff(moment(b)));
  return dates.map(date => {
    const dateLeaderboard = dateGroups[date];
    const averageTime = round(mean(dateLeaderboard.map(e => e.time)), 2);
    const bestTime = first(orderBy(dateLeaderboard, 'time', 'asc')).time;
    const bestTimeUsernames = map(
      filter(dateLeaderboard, (e) => e.time === bestTime),
      e => e.username
    );
    return {
      date: formatDate(date),
      averageTime,
      bestTime,
      bestTimeUsernames
    }
  });
}

export const makeTable = (placedEntries: PlacedEntry[]): UserStat[] => {
  const usernameGroups = groupBy(placedEntries, 'username');
  const usernames = keys(usernameGroups);
  const userStats = usernames.map(username => {
    const userEntries = usernameGroups[username];
    const userTimes = userEntries.map(e => e.time);
    const userPlaces = userEntries.map(e => e.place);
    const averagePlace = round(mean(userPlaces), 2);
    return {
      username,
      bestTime: min(userTimes),
      averageTime: round(mean(userTimes), 2),
      firstPlaceFinishes: sum(userPlaces.filter(place => place === 1)),
      averagePlace,
      gamesPlayed: userEntries.length,
      power: {
        rating: round(userEntries.length / averagePlace * 100, 2),
        index: 0,
      }
    };
  });
  return orderBy(userStats, 'power.rating', 'desc').map((userStat, i) => {
    userStat.power.index = i + 1;
    return userStat;
  });
}

type StreakTracker = {
  [username: string]: {
    currentStreak: number;
    longestStreak: number;
  }
}

export const getLongestStreak = (graph: Graph) => {
  let streakTracker: StreakTracker = {};

  for (let i = 0; i < graph.length; ++i) {
    const { bestTimeUsernames: todaysBestTimeUsernames } = graph[i];

    each(todaysBestTimeUsernames, username => {
      if (!streakTracker[username]) {
        // if the entry does not exist, create it and initialize it
        streakTracker[username] = {
          currentStreak: 1,
          longestStreak: 0
        }
      } else {
        // if the entry does exist, add to their current streak
        streakTracker[username].currentStreak += 1;
      }
    });

    // for all the entries in streakTracker
    each(Object.keys(streakTracker), ((username) => {
      // if the currentStreak is longer than longestStreak replace it
      const entry = streakTracker[username];
      if (entry.currentStreak > entry.longestStreak) {
        entry.longestStreak = entry.currentStreak;
      }
      // if not in todaysBestTimeUsernames, set current streak to zero
      if (!includes(todaysBestTimeUsernames, username)) {
        entry.currentStreak = 0;
      }
    }));
  }

  const streakTrackerArray = map(streakTracker, (e, username) => ({ ...e, username }));

  const longestStreakEntry = maxBy(streakTrackerArray, 'longestStreak');
  const longestStreak = longestStreakEntry?.longestStreak || 0;

  return {
    duration: longestStreak,
    usernames: filter(streakTrackerArray, e => e.longestStreak === longestStreak).map(e => e.username),
  }
}

export const makeStats = (placedEntries: PlacedEntry[], table: UserStat[], graph: Graph) => {
  // v2: use the graph to get the longest streak
  const bestTime = first(orderBy(placedEntries, ['time', 'date'], ['asc', 'desc']));
  const highestPowerIndex = first(table);
  const averageTime = mean(placedEntries.map(e => e.time));
  const bestAvePlace = reduce(table, (bestUserStat, currentUserStat) => {
    if (currentUserStat.averagePlace < bestUserStat.averagePlace) {
      return currentUserStat;
    }
    return bestUserStat;
  });
  const longestStreak = getLongestStreak(graph);
  return {
    bestTime, averageTime, bestAvePlace, highestPowerIndex, longestStreak
  }
}
