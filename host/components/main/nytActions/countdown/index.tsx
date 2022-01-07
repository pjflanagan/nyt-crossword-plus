import React, { FC, useEffect, useState } from 'react';
import { Progress } from 'antd';
import moment from 'moment';

// TODO: v1 https://spin.atomicobject.com/2016/07/25/date-math-time-zones-moment/

const HOUR_IN_S = 60 * 60;
const DAY_IN_S = 24 * HOUR_IN_S;
const MINUTE_IN_MS = 60 * 1000;

const prefix0 = (num: string): string => {
  return (num.length === 1) ? `0${num}` : num;
}

// time is in seconds
const formatTime = (time: number): string => {
  const hours = Math.floor(time / HOUR_IN_S);
  const minutes = Math.floor(time % HOUR_IN_S / 60);
  return `${hours}h:${prefix0(`${minutes}`)}m`;
}

// get the hour the crossword comes out on a day
const getReleaseHourForDay = (date: moment.Moment) => {
  if (date.day() === 0 || date.day() === 6) {
    // 6pm on Sunday and Saturday
    return 18;
  }
  // 10pm on other days
  return 22;
}

// get if the crossword has released already today
const hasReleasedCrosswordToday = () => {
  return moment().get('hour') >= getReleaseHourForDay(moment());
}

// get the next time there will be a release
const getNextReleaseTime = (): moment.Moment => {
  const nextReleaseDate = moment();
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
const getTimeUntilNextRelease = () => {
  return getNextReleaseTime().diff(moment(), 'seconds');
}

const Countdown: FC = () => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    setTime(getTimeUntilNextRelease());
    setInterval(() => {
      setTime(getTimeUntilNextRelease());
    }, MINUTE_IN_MS);
  }, []);

  return (
    <Progress
      size="small"
      percent={(DAY_IN_S - time) / DAY_IN_S * 100}
      status="active"
      format={() => formatTime(time)}
      style={{ padding: '0 1em 0 0', maxWidth: '480px' }}
    />
  );
}


export { Countdown }