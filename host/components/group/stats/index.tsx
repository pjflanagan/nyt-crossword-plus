import React, { FC } from 'react';
import { Row, Card, Statistic } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import { TimeEntry, UserStat } from '../../../types';

type StatsComponentProps = {
  bestAvePlace: UserStat;
  bestTime: TimeEntry;
  averageTime: number;
}

const StatsComponent: FC<StatsComponentProps> = ({
  bestAvePlace,
  bestTime,
  averageTime,
}) => {

  const bestAvePlaceTitle = (
    <div style={{ height: '44px' }}>
      <p style={{ margin: 0, fontSize: '1.2em' }}>Highest Ave Place</p>
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

  return (
    <Row>
      <Card>
        <Statistic
          title={bestAvePlaceTitle}
          value={bestAvePlace.averagePlace}
        />
      </Card>
      <Card>
        <Statistic
          title={bestTimeTitle}
          value={bestTime.time}
          suffix="s"
        />
      </Card>
      <Card>
        <Statistic
          title={aveTimeTitle}
          value={_.round(averageTime, 2)}
          suffix="s"
        />
      </Card>
    </Row>
  );
}

export { StatsComponent };
