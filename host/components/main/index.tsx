import React, { FC } from 'react';

import { GroupLoginComponent } from './groupLogin';
import { NytActionsComponents } from './nytActions';
import { PageComponent } from '../page';

const MainComponent: FC = () => {
  return (
    <PageComponent>
      {/* TODO: get if this needs an update */}
      <NytActionsComponents needsUpdate={false} />
      <GroupLoginComponent />
    </PageComponent>
  );
}


export { MainComponent }