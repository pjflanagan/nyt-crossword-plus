import React, { FC } from 'react';
import { Layout, Typography, Empty } from 'antd';
import _ from 'lodash';

import { PlacedEntry, TimeEntry, UserStat, DateEntries } from '../../types';

import { StatsComponent } from './stats';

const { Header, Content } = Layout;
const { Title } = Typography;

const getPlacedEntries = (dateGroups: DateEntries): PlacedEntry[] => {
  return _.keys(dateGroups).map(date => {
    const datePlaces = [];
    let lastTime = 0;
    let place = 0;
    dateGroups[date].forEach((entry) => {
      if (lastTime !== entry.time) {
        ++place;
      }
      lastTime = entry.time;
      datePlaces.push({
        ...entry,
        place,
      });
    });
    return datePlaces;
  }).flat();
};

// const makeGraph = (dateGroups: DateEntries): [moment.Moment, { averageTime, bestTime, bestUsername } ]

const makeTable = (placedEntries: PlacedEntry[]): UserStat[] => {
  const usernameGroups = _.groupBy(placedEntries, 'username');
  return _.keys(usernameGroups).map(username => {
    const userEntries = usernameGroups[username];
    const userTimes = userEntries.map(e => e.time);
    const userPlaces = userEntries.map(e => e.place);
    return {
      username,
      bestTime: _.min(userTimes),
      averageTime: _.mean(userTimes),
      averagePlace: _.mean(userPlaces),
      gamesPlayed: userEntries.length,
      firstPlaceFinishes: _.sum(userPlaces.filter(place => place === 1)),
    };
  }).flat();
}

type GroupComponentProps = {
  name: string;
  entries: TimeEntry[];
}

const GroupComponent: FC<GroupComponentProps> = ({
  name,
  entries
}) => {

  // TODO: exclude Sundays option and calendar dates in filters

  const renderContent = () => {
    if (entries.length === 0) {
      return <Empty />
    }

    // TODO: filter dates here
    const orderedEntries = _.orderBy(entries, 'time', 'asc');
    const dateGroups = _.groupBy(orderedEntries, 'date');
    const placedEntries = getPlacedEntries(dateGroups);
    // const dateChart = makeChart(dateGroups);
    const table = makeTable(placedEntries);
    console.table(table);

    return (
      <>
        <StatsComponent placedEntries={placedEntries} />
      </>
    );
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header style={{ color: '#fff' }}>
        New York Times Crossword Leaderboard Plus
      </Header>
      <Content style={{ padding: '1em' }}>
        <Title>{name}</Title>
        {renderContent()}
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