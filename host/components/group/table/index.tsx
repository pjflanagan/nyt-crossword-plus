import React, { FC } from 'react';
import { Row, Table, Tooltip } from 'antd';

import { UserStat } from '../../../types';

import Style from './style.module.css';

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'name',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'Power Index',
    dataIndex: 'power',
    key: 'power',
    sorter: (a, b) => a.power.index - b.power.index,
    sortDirections: ['ascend'],
    defaultSortOrder: 'ascend',
    render: (power) => (
      <Tooltip placement="topLeft" title={power.rating}>
        {power.index}
      </Tooltip>
    ),
  },
  {
    title: 'Best Time',
    dataIndex: 'bestTime',
    key: 'bestTime',
    sorter: (a, b) => a.bestTime - b.bestTime,
    sortDirections: ['ascend']
  },
  {
    title: 'Average Time',
    dataIndex: 'averageTime',
    key: 'averageTime',
    sorter: (a, b) => a.averageTime - b.averageTime,
    sortDirections: ['ascend']
  },
  {
    title: 'First Place Finishes',
    dataIndex: 'firstPlaceFinishes',
    key: 'firstPlaceFinishes',
    sorter: (a, b) => a.firstPlaceFinishes - b.firstPlaceFinishes,
    sortDirections: ['descend']
  },
  {
    title: 'Average Place',
    dataIndex: 'averagePlace',
    key: 'averagePlace',
    sorter: (a, b) => a.averagePlace - b.averagePlace,
    sortDirections: ['ascend']
  },
  {
    title: 'Games Played',
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
    <Row className={Style.tableRow}>
      <Table
        dataSource={table}
        columns={COLUMNS as any}
        pagination={{ pageSize: 20 }}
        scroll={{ y: 480, x: 900 }}
      />
    </Row>
  );
}

export { TableComponent };
