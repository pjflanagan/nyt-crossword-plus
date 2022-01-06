import React, { FC } from 'react';
import { Row, Card, Statistic } from 'antd';
import _ from 'lodash';

import { TimeEntry } from '../../../types';
import moment from 'moment';

type StatsComponentProps = {
  placedEntries: TimeEntry[];
}

const StatsComponent: FC<StatsComponentProps> = ({
  placedEntries,
}) => {

  const bestTime = placedEntries[0];
  const averageTime = _.mean(placedEntries.map(e => e.time));

  // const highestAveTime = (
  //   <div style={{ height: '44px' }}>
  //     <p style={{ margin: 0, fontSize: '1.2em' }}>Highest Ave Place</p>
  //     <p style={{ margin: 0, fontSize: '0.9em' }}>{bestTime.username}</p>
  //   </div>
  // );

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
          title={bestTimeTitle}
          value={bestTime.time}
          suffix="s"
        />
      </Card>
      <Card>
        <Statistic
          title={aveTimeTitle}
          value={Math.round(averageTime * 10) / 10}
          suffix="s"
        />
      </Card>
    </Row>
  );
}

export { StatsComponent };
