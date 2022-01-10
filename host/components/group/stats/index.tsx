import React, { FC } from 'react';
import { Row, Card, Statistic, Space } from 'antd';
import { round } from 'lodash';
import moment from 'moment';

import { TimeEntry, UserStat } from '../../../types';

import Style from './style.module.css';
import { formatTime } from '../helpers';

type StatsComponentProps = {
  bestAvePlace: UserStat;
  highestPowerIndex: UserStat;
  bestTime: TimeEntry;
  averageTime: number;
}

const StatsComponent: FC<StatsComponentProps> = ({
  bestAvePlace,
  bestTime,
  averageTime,
  highestPowerIndex,
}) => {

  // IDEA: longest streak, streaks are not very common though

  return (
    <Row className={Style.statsRow}>
      <Card title="Highest Power Rating">
        <Statistic
          title={highestPowerIndex.username}
          value={highestPowerIndex.power.rating}
        />
      </Card>
      <Card title="Best Ave Place">
        <Statistic
          title={bestAvePlace.username}
          value={bestAvePlace.averagePlace}
        />
      </Card>
      <Card title="Best Time">
        <Statistic
          title={`${bestTime.username} - ${moment(bestTime.date).utcOffset(-5).format('MMM D')}`}
          value={formatTime(bestTime.time)}
        />
      </Card>
      <Card title="Average Time">
        <Statistic
          title={<div style={{ height: '22px' }} />}
          value={formatTime(round(averageTime, 2))}
        />
      </Card>
    </Row>
  );
}

export { StatsComponent };
