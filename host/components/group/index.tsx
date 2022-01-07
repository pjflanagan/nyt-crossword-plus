import React, { FC, useEffect, useMemo, useState } from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import { orderBy, groupBy } from 'lodash';

import { PageComponent } from '../page';
import { PlacedEntry, TimeEntry } from '../../types';

import { StatsComponent } from './stats';
import { TableComponent } from './table';
import { GraphComponent } from './graph';
import { Filter, DEFAULT_FILTER, FilterComponent } from './filter';
import { makeStats, makeGraph, makeTable, getPlacedEntries, makeFilteredEntries } from './helpers';

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

  const dashboardData = useMemo(() => {
    // this runs only when the filter or placedEntries changes
    const filteredEntries = makeFilteredEntries(filter, placedEntries);
    const graph = makeGraph(filteredEntries);
    const table = makeTable(filteredEntries);
    const { bestTime, averageTime, bestAvePlace, highestPowerIndex } = makeStats(filteredEntries, table);

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
    const orderedEntries = orderBy(entries, 'time', 'asc');
    const dateGroups = groupBy(orderedEntries, 'date');
    const onloadPlacedEntries = getPlacedEntries(dateGroups);
    setPlacedEntries(onloadPlacedEntries);
  }, []);


  const renderContent = () => {
    if (placedEntries.length === 0) {
      return (
        <Row className={Style.emptyRow}>
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
        />
        <GraphComponent graph={dashboardData.graph} />
        <TableComponent table={dashboardData.table} />
      </>
    );
  }

  return (
    <PageComponent>
      <Row>
        <Col span={8}>
          <Title className={Style.title}>{name}</Title>
        </Col>
        <Col span={16}>
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