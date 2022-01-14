import { FC, useMemo, useState } from 'react';

import { PlacedEntry } from '../../../types';
import { makeGraph, makeTable, getLongestStreak, getBestAveragePlace, getHighestPowerIndex, getBestTime, getAverageTime } from '../../../helpers';

import { StatsComponent } from './stats';
import { TableComponent } from './table';
import { GraphComponent } from './graph';

type ContentComponentProps = {
  filteredEntries: PlacedEntry[]
}

const ContentComponent: FC<ContentComponentProps> = ({
  filteredEntries
}) => {

  const [currentUsername, setCurrentUsername] = useState<string>('');

  const graph = useMemo(() => makeGraph(filteredEntries, currentUsername), [makeGraph, filteredEntries, currentUsername]);
  const table = useMemo(() => makeTable(filteredEntries), [makeTable, filteredEntries]);

  const bestTimeUsernamesByDate = graph.map(e => e.bestTimeUsernames);
  const longestStreak = useMemo(() => getLongestStreak(bestTimeUsernamesByDate), [getLongestStreak, bestTimeUsernamesByDate]);
  const bestAvePlace = useMemo(() => getBestAveragePlace(table), [getBestAveragePlace, table]);
  const highestPowerIndex = useMemo(() => getHighestPowerIndex(table), [getHighestPowerIndex, table]);
  const bestTime = useMemo(() => getBestTime(filteredEntries), [getBestTime, filteredEntries]);
  const averageTime = useMemo(() => getAverageTime(filteredEntries), [getAverageTime, filteredEntries]);

  return (
    <>
      <StatsComponent
        bestAvePlace={bestAvePlace}
        bestTime={bestTime}
        averageTime={averageTime}
        highestPowerIndex={highestPowerIndex}
        longestStreak={longestStreak}
      />
      <GraphComponent graph={graph} currentUsername={currentUsername} />
      <TableComponent table={table} currentUsername={currentUsername} setCurrentUsername={setCurrentUsername} />
    </>
  );
}

export { ContentComponent };