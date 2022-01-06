import React, { FC, useEffect, useMemo, useState } from 'react';
import { Layout, Typography, Empty } from 'antd';
import _ from 'lodash';

import { PlacedEntry, TimeEntry } from '../../types';

import { StatsComponent } from './stats';
import { TableComponent } from './table';
import { GraphComponent } from './graph';
import { Filter, DEFAULT_FILTER, FilterComponent } from './filter';
import { makeStats, makeGraph, makeTable, getPlacedEntries } from './helpers';

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

  const [placedEntries, setPlacedEntries] = useState<PlacedEntry[]>([]);
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);

  const dashboardData = useMemo(() => {
    // this runs only when the filter or placedEntries changes
    // TODO: filter the placedEntries here

    const graph = makeGraph(placedEntries);
    const table = makeTable(placedEntries);
    const { bestTime, averageTime, bestAvePlace, highestPowerIndex } = makeStats(placedEntries, table);

    return {
      graph,
      table,
      bestTime,
      averageTime,
      bestAvePlace,
      highestPowerIndex
    };

  }, [placedEntries, filter]);

  useEffect(() => {
    // this runs once on load to calculate place by dates for every entry
    const orderedEntries = _.orderBy(entries, 'time', 'asc');
    const dateGroups = _.groupBy(orderedEntries, 'date');
    const onloadPlacedEntries = getPlacedEntries(dateGroups);
    setPlacedEntries(onloadPlacedEntries);
  }, []);


  const renderContent = () => {
    if (placedEntries.length === 0) {
      return <Empty />
    }

    return (
      <>
        <FilterComponent filter={filter} setFilter={setFilter} />
        <StatsComponent
          bestAvePlace={dashboardData.bestAvePlace}
          bestTime={dashboardData.bestTime}
          averageTime={dashboardData.averageTime}
          highestPowerIndex={dashboardData.highestPowerIndex}
        />
        <GraphComponent graph={dashboardData.graph} />
        <TableComponent table={dashboardData.table} />
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