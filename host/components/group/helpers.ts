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

import { PlacedEntry, UserStat, DateEntries } from '../../types';
import { GraphType } from './graph';
import type { Filter } from './filter';

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
        moment: moment(entry.date)
      });
    });
    return datePlaces;
  });
  return flatten(placedDates);
};

export const makeFilteredEntries = (filterParams: Filter, placedEntries: PlacedEntry[]) => {
  let filteredEntries = placedEntries;
  if (filterParams.excludeSundays) {
    filteredEntries = filter(filteredEntries, (entry) => entry.moment.format('dddd') !== 'Sunday');
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
      date: moment(date).format('MMM D'),
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
  const bestTime = first(placedEntries);
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

const prefix0 = (num: string): string => {
  return (num.length === 1) ? `0${num}` : num;
}

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${prefix0(`${seconds}`)}`;
}
