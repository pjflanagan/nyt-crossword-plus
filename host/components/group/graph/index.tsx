import React, { FC } from 'react';
import { Row, Card } from 'antd';
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

import { formatTime } from '../../../helpers';
import { Graph } from '../../../types';

import Style from './style.module.css';

type GraphComponentProps = {
  graph: Graph;
}

const formatTooltip = (value, name, props) => {
  if (name === 'Best Time') {
    return `${formatTime(value)} by ${props.payload.bestTimeUsernames.join(', ')}`;
  }
  return formatTime(value);
}

const GraphComponent: FC<GraphComponentProps> = ({
  graph
}) => {
  const breakpoints = useBreakpoint();
  const width: number = ((): number => {
    switch (true) {
      case breakpoints.lg:
        return 720;
      case breakpoints.md:
        return 640;
      case breakpoints.sm:
        return 480;
      default:
        return 280;
    }
  })();

  return (
    <Row className={Style.graphRow}>
      <Card className={`${Style.graphCard} graphCard`} title="Calendar">
        <LineChart width={width} height={200} data={graph}>
          {breakpoints.md && <Legend verticalAlign="top" height={36} />}
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(s) => formatTime(s)} />
          <Tooltip formatter={formatTooltip} />
          <Line type="monotone" dataKey="averageTime" name='Average Time' stroke="#001529" />
          <Line type="monotone" dataKey="bestTime" name='Best Time' stroke="#40a9ff" strokeWidth={0} dot={{ stroke: '#40a9ff', strokeWidth: 2 }} />
        </LineChart>
      </Card>
    </Row>
  );
}

export { GraphComponent };
