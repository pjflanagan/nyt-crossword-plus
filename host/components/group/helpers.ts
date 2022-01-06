import {
  keys,
  groupBy,
  reverse,
  mean,
  reduce,
  sum,
  round,
  min,
  orderBy,
  flatten,
  first
} from 'lodash';
import moment from 'moment';

import { PlacedEntry, UserStat, DateEntries } from '../../types';
import { GraphType } from './graph';

export const getPlacedEntries = (dateGroups: DateEntries): PlacedEntry[] => {
  const dates = keys(dateGroups);
  const placedDates = dates.map(date => {
    const datePlaces = [];
    let lastTime = 0;
    let place = 0;
    dateGroups[date].forEach((entry) => {
      if (lastTime !== entry.time) {
        ++place;
      }
      lastTime = entry.time;
      datePlaces.push({
        ...entry,
        place,
      });
    });
    return datePlaces;
  });
  return flatten(placedDates);
};

export const makeGraph = (placedEntries: PlacedEntry[]): GraphType[] => {
  const dateGroups = groupBy(placedEntries, 'date');
  const dates = keys(dateGroups).sort((a, b) => moment(a).diff(moment(b)));
  return dates.map(date => {
    const dateLeaderboard = dateGroups[date];
    const averageTime = round(mean(dateLeaderboard.map(e => e.time)), 2);
    const bestTimeEntry = first(orderBy(dateLeaderboard, 'time', 'asc'));
    return {
      date: moment(date).format('MMM D'),
      averageTime,
      bestTime: bestTimeEntry.time,
      bestTimeUsername: bestTimeEntry.username
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
  const bestTime = placedEntries[0];
  const highestPowerIndex = table[0];
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
