import React, { FC } from 'react';
import { Radio, Checkbox, Space } from 'antd';

import { Filter } from '../../../types';

import Style from './style.module.css';

export const DEFAULT_FILTER: Filter = {
  excludeMidis: false,
  duration: 8
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
      excludeMidis: e.target.checked
    })
  }

  return (
    <Space className={Style.filter}>
      <Checkbox onChange={changeExcludeSundays}>Mini Only</Checkbox>
      <Radio.Group value={filter.duration} onChange={changeDuration}>
        {/* <Radio.Button value={3}>3 Days</Radio.Button> */}
        <Radio.Button value={8}>Week</Radio.Button>
        <Radio.Button value={31}>Month</Radio.Button>
        <Radio.Button value={false}>All</Radio.Button>
      </Radio.Group>
    </Space>
  );
}

export { FilterComponent };
