import React, { FC, useMemo, useState } from 'react';
import { Row, Col, Typography, Empty, Spin } from 'antd';
import { orderBy, groupBy } from 'lodash';

import { TimeEntry, Filter } from 'types';
import { getDatesLeaderboards, makeFilteredEntries } from 'helpers';

import { PageComponent } from '../page';

import { DEFAULT_FILTER, FilterComponent } from './filter';
import { ContentComponent } from './content';

import Style from './style.module.css';

const { Title } = Typography;

type GroupComponentProps = {
  name: string;
  entries: TimeEntry[];
  isLoading: boolean;
}

const GroupComponent: FC<GroupComponentProps> = ({
  name,
  entries,
  isLoading
}) => {

  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);

  // this runs only when the filter or placedEntries changes
  const filteredEntries = useMemo(
    () => {
      const orderedEntries = orderBy(entries, 'time', 'asc');
      const dateGroups = groupBy(orderedEntries, 'date');
      const placedEntries = getDatesLeaderboards(dateGroups);
      return makeFilteredEntries(filter, placedEntries)
    },
    [makeFilteredEntries, filter, entries]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Row className={Style.noContentRow}>
          <Spin size="large" />
        </Row>
      );
    }

    if (entries.length === 0) {
      return (
        <Row className={Style.noContentRow}>
          <Empty />
        </Row>
      );
    }

    return (
      <ContentComponent filteredEntries={filteredEntries} />
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