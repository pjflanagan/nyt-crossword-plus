import React, { FC, useEffect, useState } from 'react';

import { getCurrentlyAvailableCrosswordDate } from 'helpers';

import { PageComponent } from '../page';

import { GroupLoginComponent } from './groupLogin';
import { NytActionsComponents } from './nytActions';

const MainComponent: FC = () => {

  const [leaderboardNeedsUpdate, setLeaderboardNeedsUpdate] = useState(false);

  useEffect(() => {
    const fetchInitData = async () => {
      const date = getCurrentlyAvailableCrosswordDate();
      const url = encodeURI(`/api/times/read/entryCount?date=${date}`);

      const resp = await fetch(url);
      let { entryCount: _, hasEntries, errorMessage } = await resp.json();

      if (errorMessage && errorMessage !== '') {
        console.error(errorMessage);
        return;
      }

      setLeaderboardNeedsUpdate(!hasEntries);
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