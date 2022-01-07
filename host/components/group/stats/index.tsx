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

  const highestPowerIndexTitle = (
    <div style={{ height: '44px' }}>
      <p style={{ margin: 0, fontSize: '1.2em' }}>Highest Power Rating</p>
      <p style={{ margin: 0, fontSize: '0.9em' }}>{highestPowerIndex.username}</p>
    </div>
  );

  const bestAvePlaceTitle = (
    <div style={{ height: '44px' }}>
      <p style={{ margin: 0, fontSize: '1.2em' }}>Best Ave Place</p>
      <p style={{ margin: 0, fontSize: '0.9em' }}>{bestAvePlace.username}</p>
    </div>
  );

  const bestTimeDateFormatted = moment(bestTime.date).format('MMM D');
  const bestTimeTitle = (
    <div style={{ height: '44px' }}>
      <p style={{ margin: 0, fontSize: '1.2em' }}>Best Time</p>
      <p style={{ margin: 0, fontSize: '0.9em' }}>{`${bestTime.username} - ${bestTimeDateFormatted}`}</p>
    </div>
  );

  const aveTimeTitle = (
    <div style={{ height: '44px' }}>
      <p style={{ margin: 0, fontSize: '1.2em' }}>Average Time</p>
    </div>
  );

  // const renderStatisticTitle = (title, subTitle) => {
  //   return (
  //     <div style={{ height: '44px' }}>
  //       <p style={{ margin: 0, fontSize: '1.2em' }}>Best Time</p>
  //       <p style={{ margin: 0, fontSize: '0.9em' }}>{`${bestTime.username} - ${bestTimeDateFormatted}`}</p>
  //     </div>
  //   )
  // }

  return (
    <Row className={Style.statsRow}>
      <Card>
        <Statistic
          title={highestPowerIndexTitle}
          value={highestPowerIndex.power.rating}
        />
      </Card>
      <Card>
        <Statistic
          title={bestAvePlaceTitle}
          value={bestAvePlace.averagePlace}
        />
      </Card>
      <Card>
        <Statistic
          title={bestTimeTitle}
          value={formatTime(bestTime.time)}
        />
      </Card>
      <Card>
        <Statistic
          title={aveTimeTitle}
          value={formatTime(round(averageTime, 2))}
        />
      </Card>
    </Row>
  );
}

export { StatsComponent };
