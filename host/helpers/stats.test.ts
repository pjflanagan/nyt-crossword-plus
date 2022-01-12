import assert from 'assert';

import { Graph, GraphDateEntry } from '../types';

import { getLongestStreak } from '.';

const makeGraphEntryForLongestStreak = (date: string, bestTimeUsernames: string[]): GraphDateEntry => {
  return {
    date,
    averageTime: 0,
    bestTime: 1,
    bestTimeUsernames
  }
}

describe('helpers/stats.ts', function () {
  describe('getLongestStreak', function () {
    type TestData = [Graph, number, string[]];
    const td: TestData[] = [
      [
        [
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
        ],
        3,
        ['A'],
      ],
      [
        [
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['B', 'A']),
          makeGraphEntryForLongestStreak('', ['B']),
          makeGraphEntryForLongestStreak('', ['B']),
        ],
        3,
        ['A', 'B'],
      ],
      [
        [
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['C', 'B']),
          makeGraphEntryForLongestStreak('', ['A']),
        ],
        1,
        ['A', 'B', 'C'],
      ],
      [
        [
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['B']),
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
          makeGraphEntryForLongestStreak('', ['A']),
        ],
        3,
        ['A',],
      ],
    ];

    td.forEach(([graph, duration, usernames]) => {
      it(`should return ${duration} for ${usernames.join(', ')}`, function () {
        const longestStreak = getLongestStreak(graph);
        assert.equal(longestStreak.duration, duration);
        assert.deepEqual(longestStreak.usernames.sort(), usernames.sort());
      });
    });
  });
});

