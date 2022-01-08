import React, { FC } from 'react';
import { Radio, Checkbox, Space } from 'antd';

import Style from './style.module.css';

export type Filter = {
  excludeSundays: boolean;
  duration: 3 | 7 | 31 | false;
};

export const DEFAULT_FILTER: Filter = {
  excludeSundays: false,
  duration: 7
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
      excludeSundays: e.target.checked
    })
  }

  return (
    <Space className={Style.filter}>
      <Checkbox onChange={changeExcludeSundays}>Mini Only</Checkbox>
      <Radio.Group value={filter.duration} onChange={changeDuration}>
        {/* <Radio.Button value={3}>3 Days</Radio.Button> */}
        <Radio.Button value={7}>Week</Radio.Button>
        <Radio.Button value={31}>Month</Radio.Button>
        <Radio.Button value={false}>All</Radio.Button>
      </Radio.Group>
    </Space>
  );
}

export { FilterComponent };
