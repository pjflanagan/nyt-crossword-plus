import React, { FC } from 'react';

import { GroupLoginComponent } from './groupLogin';
import { NytActionsComponents } from './nytActions';
import { PageComponent } from '../page';

const MainComponent: FC = () => {
  return (
    <PageComponent>
      <NytActionsComponents />
      <GroupLoginComponent />
    </PageComponent>
  );
}


export { MainComponent }