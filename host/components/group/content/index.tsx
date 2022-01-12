import { FC, useMemo } from 'react';

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

  const graph = useMemo(() => makeGraph(filteredEntries), [makeGraph, filteredEntries]);
  const table = useMemo(() => makeTable(filteredEntries), [makeTable, filteredEntries]);
  const longestStreak = useMemo(() => getLongestStreak(graph), [getLongestStreak, graph]);
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
      <GraphComponent graph={graph} />
      <TableComponent table={table} />
    </>
  );
}

export { ContentComponent };