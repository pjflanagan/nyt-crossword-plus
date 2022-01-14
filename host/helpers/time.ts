import moment from "moment";

// the time in New York
const getTimeInNewYork = (): moment.Moment => {
  return moment().utcOffset(-5);
}

// get the hour the crossword comes out on a day
const getReleaseHourForDay = (date: moment.Moment): number => {
  if (date.day() === 0 || date.day() === 6) {
    // 6pm on Sunday and Saturday
    return 18;
  }
  // 10pm on other days
  return 22;
}

// get if the crossword has released already today
const hasReleasedCrosswordToday = (): boolean => {
  const timeInNewYork = getTimeInNewYork();
  return timeInNewYork.get('hour') >= getReleaseHourForDay(timeInNewYork);
}

// get the next time there will be a release
export const getNextReleaseTime = (): moment.Moment => {
  const nextReleaseDate = getTimeInNewYork();
  nextReleaseDate.set('hour', getReleaseHourForDay(nextReleaseDate));
  nextReleaseDate.set('minute', 0);
  nextReleaseDate.set('seconds', 0);
  if (hasReleasedCrosswordToday()) {
    nextReleaseDate.add(1, 'day');
    nextReleaseDate.set('hour', getReleaseHourForDay(nextReleaseDate))
  }
  return nextReleaseDate;
}

// get the time until the next release
export const getTimeUntilNextRelease = (): number => {
  return getNextReleaseTime().diff(moment(), 'seconds');
}

// current date of the crossword
export const getCurrentlyAvailableCrosswordDate = (): string => {
  const timeInNewYork = getTimeInNewYork();
  if (hasReleasedCrosswordToday()) {
    timeInNewYork.add(1, 'day');
  }
  return timeInNewYork.format('YYYY-MM-DD');
}
