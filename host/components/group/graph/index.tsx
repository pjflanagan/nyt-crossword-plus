import React, { FC } from 'react';
import { Row } from 'antd';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';
// import _ from 'lodash';
// import moment from 'moment';

export type GraphType = {
  date: string;
  averageTime: number;
}

type GraphComponentProps = {
  graph: GraphType[];
}

const GraphComponent: FC<GraphComponentProps> = ({
  graph
}) => {
  return (
    <Row>
      <LineChart width={600} height={200} data={graph}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="averageTime" stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="best" stroke="#82ca9d" /> */}
      </LineChart>
    </Row>
  );
}

export { GraphComponent };
