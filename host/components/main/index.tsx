import React, { FC } from 'react';
import { Divider } from 'antd';

import { GroupLoginComponent } from './groupLogin';
import { NytActionsComponents } from './nytActions';
import { PageComponent } from '../page';

const MainComponent: FC = () => {
  return (
    <PageComponent>
      <NytActionsComponents />
      <Divider />
      <GroupLoginComponent />
    </PageComponent>
  );
}


export { MainComponent }