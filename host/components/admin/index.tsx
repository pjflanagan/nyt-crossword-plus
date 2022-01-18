
import React, { FC } from 'react';

import { PageComponent } from '../page';

import { LeaderboardEntryComponent } from './leaderboardEntry';

const AdminComponent: FC = () => {
  return (
    <PageComponent>
      <LeaderboardEntryComponent />
    </PageComponent>
  );
}

export { AdminComponent }