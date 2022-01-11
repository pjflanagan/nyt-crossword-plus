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
  map
} from 'lodash';
import moment from 'moment';


import { PlacedEntry, UserStat, DateEntries, TimeEntry, GraphType, Filter } from '../types';

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

export const getDatesLeaderboards = (dateGroups: DateEntries): PlacedEntry[] => {
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

export const makeGraph = (placedEntries: PlacedEntry[]): GraphType[] => {
  const dateGroups = groupBy(placedEntries, 'date');
  const dates = keys(dateGroups).sort((a, b) => moment(a).diff(moment(b)));
  return dates.map(date => {
    const dateLeaderboard = dateGroups[date];
    const averageTime = round(mean(dateLeaderboard.map(e => e.time)), 2);
    const bestTime = first(orderBy(dateLeaderboard, 'time', 'asc')).time;
    const bestTimeUsername = map(
      filter(dateLeaderboard, (e) => e.time === bestTime),
      e => e.username
    ).join(', ');
    return {
      date: formatDate(date),
      averageTime,
      bestTime,
      bestTimeUsername
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

export const makeStats = (placedEntries: PlacedEntry[], table: UserStat[]) => {
  const bestTime = first(orderBy(placedEntries, ['time', 'date'], ['asc', 'desc']));
  const highestPowerIndex = first(table);
  const averageTime = mean(placedEntries.map(e => e.time));
  const bestAvePlace = reduce(table, (bestUserStat, currentUserStat) => {
    if (currentUserStat.averagePlace < bestUserStat.averagePlace) {
      return currentUserStat;
    }
    return bestUserStat;
  });
  return {
    bestTime, averageTime, bestAvePlace, highestPowerIndex
  }
}
