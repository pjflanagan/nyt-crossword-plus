import React, { FC } from 'react';
import { Row, Card, Statistic } from 'antd';
import { round } from 'lodash';

import { TimeEntry, UserStat } from '../../../../types';
import { formatDate, formatTimeMMSS } from '../../../../helpers';

import Style from './style.module.css';

type StatsComponentProps = {
  bestAvePlace: UserStat;
  highestPowerIndex: UserStat;
  bestTime: TimeEntry;
  averageTime: number;
  longestStreak: {
    duration: number;
    usernames: string[];
  }
}

const StatsComponent: FC<StatsComponentProps> = ({
  bestAvePlace,
  bestTime,
  averageTime,
  highestPowerIndex,
  longestStreak,
}) => {
  return (
    <Row className={Style.statsRow}>
      <Card title="Highest Power Rating">
        <Statistic
          title={highestPowerIndex.username}
          value={highestPowerIndex.power.rating}
        />
      </Card>
      {
        longestStreak.duration > 1 && <Card title="Longest Streak">
          <Statistic
            title={longestStreak.usernames.join(', ')}
            value={longestStreak.duration}
          />
        </Card>
      }
      <Card title="Best Ave Place">
        <Statistic
          title={bestAvePlace.username}
          value={bestAvePlace.averagePlace}
        />
      </Card>
      <Card title="Fastest Time">
        <Statistic
          title={`${bestTime.username} - ${formatDate(bestTime.date)}`}
          value={formatTimeMMSS(bestTime.time)}
        />
      </Card>
      <Card title="Average Time">
        <Statistic
          title={<div style={{ height: '22px' }} />}
          value={formatTimeMMSS(round(averageTime, 2))}
        />
      </Card>
    </Row>
  );
}

export { StatsComponent };
