import { FC, useMemo, useState } from 'react';

import { PlacedEntry } from 'types';
import { makeGraph, makeTable, getLongestStreak, getBestAveragePlace, getHighestPowerIndex, getBestTime, getAverageTime } from 'helpers';

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

  const graph = useMemo(() => makeGraph(filteredEntries, currentUsername), [filteredEntries, currentUsername]);
  const table = useMemo(() => makeTable(filteredEntries), [filteredEntries]);

  const bestTimeUsernamesByDate = graph.map(e => e.bestTimeUsernames);
  const longestStreak = useMemo(() => getLongestStreak(bestTimeUsernamesByDate), [bestTimeUsernamesByDate]);
  const bestAvePlace = useMemo(() => getBestAveragePlace(table), [table]);
  const highestPowerIndex = useMemo(() => getHighestPowerIndex(table), [table]);
  const bestTime = useMemo(() => getBestTime(filteredEntries), [filteredEntries]);
  const averageTime = useMemo(() => getAverageTime(filteredEntries), [filteredEntries]);

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