import React, { FC } from 'react';
import { Row, Table, Tooltip } from 'antd';

import { TableRow, UserStat } from '../../../../types';
import { formatTimeMMSS } from '../../../../helpers';

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
    title: 'Fastest Time',
    dataIndex: 'bestTime',
    key: 'bestTime',
    sorter: (a, b) => a.bestTime - b.bestTime,
    sortDirections: ['ascend'],
    render: (bestTime: number) => formatTimeMMSS(bestTime)
  },
  {
    title: 'Average Time',
    dataIndex: 'averageTime',
    key: 'averageTime',
    sorter: (a, b) => a.averageTime - b.averageTime,
    sortDirections: ['ascend'],
    render: (averageTime: number) => formatTimeMMSS(averageTime)
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
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
}

const TableComponent: FC<TableComponentProps> = ({
  table,
  currentUsername,
  setCurrentUsername
}) => {

  const keyedTable = table.map(e => ({ ...e, key: e.username }));

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: TableRow[]) => {
      setCurrentUsername(selectedRows[0].username);
    },
    getCheckboxProps: (record: TableRow) => ({
      // disabled
      name: record.key,
    }),
  };

  return (
    <Row className={Style.tableRow}>
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={keyedTable}
        columns={COLUMNS as any}
        pagination={{ pageSize: 20 }}
        scroll={{ y: 480, x: 900 }}
      />
    </Row>
  );
}

export { TableComponent };
