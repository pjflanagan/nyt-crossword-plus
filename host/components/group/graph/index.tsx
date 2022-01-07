import React, { FC } from 'react';
import { Row, Card } from 'antd';
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
// import _ from 'lodash';
// import moment from 'moment';

import { formatTime } from '../helpers';

import Style from './style.module.css';

export type GraphType = {
  date: string;
  averageTime: number;
  bestTime: number;
  bestTimeUsername: string;
}

type GraphComponentProps = {
  graph: GraphType[];
}

const formatTooltip = (value, name, props) => {
  if (name === 'Best Time') {
    return `${formatTime(value)} by ${props.payload.bestTimeUsername}`;
  }
  return formatTime(value);
}

const GraphComponent: FC<GraphComponentProps> = ({
  graph
}) => {
  // TODO: useBreakpoint to get widths
  return (
    <Row className={Style.graphRow}>
      <Card className={Style.graphCard}>
        <LineChart width={720} height={200} data={graph}>
          <Legend verticalAlign="top" height={36} />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(s) => formatTime(s)} />
          <Tooltip formatter={formatTooltip} />
          <Line type="monotone" dataKey="averageTime" name='Average Time' stroke="#001529" />
          <Line type="monotone" dataKey="bestTime" name='Best Time' stroke="#40a9ff" />
        </LineChart>
      </Card>
    </Row>
  );
}

export { GraphComponent };
