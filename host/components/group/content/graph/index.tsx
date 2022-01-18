import React, { FC } from 'react';
import { Row, Card } from 'antd';
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { blue, magenta } from '@ant-design/colors';

import { formatTimeMMSS } from 'helpers';
import { Graph, GraphDateEntry } from 'types';

import Style from './style.module.css';

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

type GraphComponentProps = {
  graph: Graph;
  currentUsername: string;
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

  type TooltipProps = {
    payload: GraphDateEntry;
  }

  const formatTooltip = (value: number, name: string, props: TooltipProps) => {
    if (name === 'Fastest Time') {
      return `${formatTimeMMSS(value)} by ${props.payload.bestTimeUsernames.join(', ')}`;
    }
    if (name === currentUsername) {
      return `${formatTimeMMSS(value)} for ${ordinal(props.payload.currentUsernamePlace)}`;
    }
    return formatTimeMMSS(value);
  }

  return (
    <Row className={Style.graphRow}>
      <Card className={`${Style.graphCard} graphCard`} title="Calendar">
        <LineChart width={width} height={280} data={graph}>
          {breakpoints.md && <Legend verticalAlign="top" height={36} />}
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(s) => formatTimeMMSS(s)} />
          <Tooltip formatter={formatTooltip} />
          <Line type="monotone" dataKey="averageTime" name='Average Time' stroke={blue[7]} />
          <Line type="monotone" dataKey="medianTime" name='Median Time' stroke={blue[8]} />
          <Line type="monotone" dataKey="bestTime" name='Fastest Time' stroke={blue.primary} strokeWidth={0} dot={{ stroke: blue.primary, strokeWidth: 2 }} />s
          {
            currentUsername !== '' &&
            <Line type="monotone" dataKey="currentUsernameTime" name={currentUsername} stroke={magenta.primary} strokeWidth={0} dot={{ stroke: magenta.primary, strokeWidth: 2 }} />
          }
        </LineChart>
      </Card>
    </Row>
  );
}

export { GraphComponent };
