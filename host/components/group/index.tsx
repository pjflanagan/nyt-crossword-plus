import React, { FC, useEffect, useMemo, useState } from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import { orderBy, groupBy } from 'lodash';

import { PageComponent } from '../page';
import { PlacedEntry, TimeEntry, Filter } from '../../types';

import { StatsComponent } from './stats';
import { TableComponent } from './table';
import { GraphComponent } from './graph';
import { DEFAULT_FILTER, FilterComponent } from './filter';
import { makeStats, makeGraph, makeTable, getDatesLeaderboards, makeFilteredEntries } from '../../helpers';

import Style from './style.module.css';

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

  const makeData = () => {
    // this runs only when the filter or placedEntries changes
    const filteredEntries = makeFilteredEntries(filter, placedEntries);
    const graph = makeGraph(filteredEntries);
    const table = makeTable(filteredEntries);
    const { bestTime, averageTime, bestAvePlace, highestPowerIndex, longestStreak } = makeStats(filteredEntries, table, graph);

    return {
      graph,
      table,
      bestTime,
      averageTime,
      bestAvePlace,
      highestPowerIndex,
      longestStreak
    };
  }

  const dashboardData = useMemo(makeData, [makeData, placedEntries, filter]);

  useEffect(() => {
    // this runs once on load to calculate place by dates for every entry
    const orderedEntries = orderBy(entries, 'time', 'asc');
    const dateGroups = groupBy(orderedEntries, 'date');
    const onloadPlacedEntries = getDatesLeaderboards(dateGroups);
    setPlacedEntries(onloadPlacedEntries);
  }, []);


  const renderContent = () => {
    if (placedEntries.length === 0) {
      return (
        <Row className={Style.noContentRow}>
          <Empty />
        </Row>
      );
    }

    return (
      <>
        <StatsComponent
          bestAvePlace={dashboardData.bestAvePlace}
          bestTime={dashboardData.bestTime}
          averageTime={dashboardData.averageTime}
          highestPowerIndex={dashboardData.highestPowerIndex}
          longestStreak={dashboardData.longestStreak}
        />
        <GraphComponent graph={dashboardData.graph} />
        <TableComponent table={dashboardData.table} />
      </>
    );
  }

  return (
    <PageComponent>
      <Row>
        <Col xs={24} sm={8} style={{ padding: '0 0.5em' }}>
          <Title className={Style.title}>{name}</Title>
        </Col>
        <Col xs={24} sm={16} style={{ padding: '0 0.5em' }}>
          <FilterComponent filter={filter} setFilter={setFilter} />
        </Col>
      </Row>
      {renderContent()}
    </PageComponent>
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