import React, { FC } from 'react';
import { Row, Table } from 'antd';

import { UserStat } from '../../../types';

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'name',
  },
  {
    title: 'Best Time',
    dataIndex: 'bestTime',
    key: 'bestTime',
    sorter: (a, b) => a.bestTime - b.bestTime,
  },
  {
    title: 'Average Time',
    dataIndex: 'averageTime',
    key: 'averageTime',
    sorter: (a, b) => a.averageTime - b.averageTime,
  },
  {
    title: 'First Place Finishes',
    dataIndex: 'firstPlaceFinishes',
    key: 'firstPlaceFinishes',
    sorter: (a, b) => a.firstPlaceFinishes - b.firstPlaceFinishes,
  },
  {
    title: 'Average Place',
    dataIndex: 'averagePlace',
    key: 'averagePlace',
    sorter: (a, b) => a.averagePlace - b.averagePlace,
  },
  {
    title: 'Game Played',
    dataIndex: 'gamesPlayed',
    key: 'gamesPlayed',
  },
];

type TableComponentProps = {
  table: UserStat[];
}

const TableComponent: FC<TableComponentProps> = ({
  table,
}) => {

  return (
    <Row>
      <Table dataSource={table} columns={COLUMNS} />
    </Row>
  );
}

export { TableComponent };
