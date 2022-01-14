import React, { FC, useEffect, useState } from 'react';

import { getCurrentlyAvailableCrosswordDate } from '../../helpers';

import { GroupLoginComponent } from './groupLogin';
import { NytActionsComponents } from './nytActions';
import { PageComponent } from '../page';

const MainComponent: FC = () => {

  const [leaderboardNeedsUpdate, setLeaderboardNeedsUpdate] = useState(false);

  useEffect(() => {
    const fetchInitData = async () => {
      const date = getCurrentlyAvailableCrosswordDate();
      const url = encodeURI(`/api/readHasLeaderboardUpdate?date=${date}`);

      const resp = await fetch(url);
      let { leaderboardEntryCount: _, hasLeaderboardUpdate, errorMessage } = await resp.json();

      if (errorMessage && errorMessage !== '') {
        console.error(errorMessage);
        return;
      }

      setLeaderboardNeedsUpdate(!hasLeaderboardUpdate);
    };

    fetchInitData();
  }, []);

  return (
    <PageComponent>
      <NytActionsComponents needsUpdate={leaderboardNeedsUpdate} />
      <GroupLoginComponent />
    </PageComponent>
  );
}


export { MainComponent }