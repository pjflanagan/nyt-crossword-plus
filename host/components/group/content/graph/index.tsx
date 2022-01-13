import React, { FC } from 'react';
import { Row, Card } from 'antd';
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { blue, magenta } from '@ant-design/colors';

import { formatTime } from '../../../../helpers';
import { Graph } from '../../../../types';

import Style from './style.module.css';

type GraphComponentProps = {
  graph: Graph;
  currentUsername: string;
}

const formatTooltip = (value, name, props) => {
  if (name === 'Best Time') {
    return `${formatTime(value)} by ${props.payload.bestTimeUsernames.join(', ')}`;
  }
  return formatTime(value);
}

const GraphComponent: FC<GraphComponentProps> = ({
  graph,
  currentUsername
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
        <LineChart width={width} height={280} data={graph}>
          {breakpoints.md && <Legend verticalAlign="top" height={36} />}
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(s) => formatTime(s)} />
          <Tooltip formatter={formatTooltip} />
          <Line type="monotone" dataKey="averageTime" name='Average Time' stroke={blue[7]} />
          <Line type="monotone" dataKey="medianTime" name='Median Time' stroke={blue[8]} />
          {
            currentUsername !== '' &&
            <Line type="monotone" dataKey="currentUsernameTime" name={currentUsername} stroke={magenta.primary} strokeWidth={0} dot={{ stroke: magenta.primary, strokeWidth: 2 }} />
          }
          <Line type="monotone" dataKey="bestTime" name='Best Time' stroke={blue.primary} strokeWidth={0} dot={{ stroke: blue.primary, strokeWidth: 2 }} />
        </LineChart>
      </Card>
    </Row>
  );
}

export { GraphComponent };
