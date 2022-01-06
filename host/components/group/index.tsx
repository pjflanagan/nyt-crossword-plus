import React, { FC } from 'react';
import { Layout, Typography, Empty } from 'antd';
import _ from 'lodash';

import { PlacedEntry, TimeEntry, UserStat, DateEntries } from '../../types';

import { StatsComponent } from './stats';
import { TableComponent } from './table';
import { GraphComponent, GraphType } from './graph';

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

const makeGraph = (dateGroups: DateEntries): GraphType[] => { // bestTime, bestUsername
  return _.reverse(_.keys(dateGroups)).map(date => {
    const averageTime = _.mean(dateGroups[date].map(e => e.time))
    return {
      date,
      averageTime
    }
  });
}

const makeTable = (placedEntries: PlacedEntry[]): UserStat[] => {
  const usernameGroups = _.groupBy(placedEntries, 'username');
  return _.keys(usernameGroups).map(username => {
    const userEntries = usernameGroups[username];
    const userTimes = userEntries.map(e => e.time);
    const userPlaces = userEntries.map(e => e.place);
    return {
      username,
      bestTime: _.min(userTimes),
      averageTime: _.round(_.mean(userTimes), 2),
      firstPlaceFinishes: _.sum(userPlaces.filter(place => place === 1)),
      averagePlace: _.round(_.mean(userPlaces), 2),
      gamesPlayed: userEntries.length,
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

    // chart
    const graph = makeGraph(dateGroups);

    // table
    const table = makeTable(placedEntries);

    // stats
    const bestTime = placedEntries[0];
    const averageTime = _.mean(placedEntries.map(e => e.time));
    const bestAvePlace = _.reduce(table, (bestUserStat, currentUserStat) => {
      if (currentUserStat.averagePlace < bestUserStat.averagePlace) {
        return currentUserStat;
      }
      return bestUserStat;
    })

    return (
      <>
        <StatsComponent bestAvePlace={bestAvePlace} bestTime={bestTime} averageTime={averageTime} />
        <GraphComponent graph={graph} />
        <TableComponent table={table} />
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

STATS
- Group average time
- Group fastest
- Current leader by ave place

GRAPH
- A graph with average times and best times over the week
    - Week has labels for fastest each day
    - Month has labels for top 3
    - “All” is just two line charts

TABLE
- A chart (top 10 only) with name, first place finishes, ave finishes, best time, ave time
    - Need some way of displaying games played, so we don’t have a winner who only played once

 */