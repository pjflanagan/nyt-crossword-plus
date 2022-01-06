import React, { FC } from 'react';
import { Row, Radio, Checkbox, Space } from 'antd';

import Style from './style.module.css';

export type Filter = {
  excludeSundays: boolean;
  duration: 'week' | 'month' | 'all';
};

export const DEFAULT_FILTER: Filter = {
  excludeSundays: false,
  duration: 'week'
};

type FilterComponentProps = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const FilterComponent: FC<FilterComponentProps> = ({
  filter,
  setFilter
}) => {

  const changeDuration = (e) => {
    setFilter({
      ...filter,
      duration: e.target.value
    });
  }

  const changeExcludeSundays = (e) => {
    setFilter({
      ...filter,
      excludeSundays: e.target.value
    })
  }

  return (
    <Space className={Style.filter}>
      <Radio.Group value={filter.duration} onChange={changeDuration}>
        <Radio.Button value="week">Week</Radio.Button>
        <Radio.Button value="month">Month</Radio.Button>
        <Radio.Button value="all">All</Radio.Button>
      </Radio.Group>
      <Checkbox onChange={changeExcludeSundays}>Exclude Sundays</Checkbox>
    </Space>
  );
}

export { FilterComponent };
