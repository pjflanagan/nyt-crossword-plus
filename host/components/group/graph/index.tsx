import React, { FC } from 'react';
import { Row, Card } from 'antd';
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
// import _ from 'lodash';
// import moment from 'moment';

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
    return `${value}s by ${props.payload.bestTimeUsername}`;
  }
  return `${value}s`;
}

const GraphComponent: FC<GraphComponentProps> = ({
  graph
}) => {
  return (
    <Row>
      <Card>
        <LineChart width={600} height={200} data={graph}>
          <Legend verticalAlign="top" height={36} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={formatTooltip} />
          {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> */}
          <Line type="monotone" dataKey="averageTime" name='Average Time' stroke="#8884d8" />
          <Line type="monotone" dataKey="bestTime" name='Best Time' stroke="#82ca9d" />
        </LineChart>
      </Card>
    </Row>
  );
}

export { GraphComponent };
