import React, { FC } from 'react';
import { Layout, Typography } from 'antd';
// TODO: import _ from 'lodash';

import { TimeEntry } from '../../types';

const { Header, Content } = Layout;
const { Title } = Typography;

type GroupComponentProps = {
  name: string;
  entries: TimeEntry[];
}

const GroupComponent: FC<GroupComponentProps> = ({
  name,
  entries
}) => {

  // TODO: if no entries, then say something and quit

  // TODO: exclude Sundays option in filters

  const bestTime = entries.sort((a, b) => a.time - b.time)[0];
  const averageTime = entries.map(e => e.time).reduce((sum, c) => sum + c) / entries.length;

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header style={{ color: '#fff' }}>
        New York Times Crossword Leaderboard Plus
      </Header>
      <Content style={{ padding: '1em' }}>
        <Title>{name}</Title>
        <Title level={2}>{`Best Time: ${bestTime.time}s by ${bestTime.username} on ${bestTime.date}`}</Title>
        <Title level={2}>{`Average Time: ${Math.round(averageTime * 10) / 10}s`}</Title>
      </Content>
    </Layout>
  );
}

export { GroupComponent }


/**

- Group average time
- Group fastest this week, this month, this ever
- Current leader by ave place
- A graph with average times and best times over the week
    - Week has labels for fastest each day
    - Month has labels for top 3
    - “All” is just two line charts
- A chart (top 10 only) with name, first place finishes, ave finishes, best time, ave time
    - Need some way of displaying games played, so we don’t have a winner who only played once

 */