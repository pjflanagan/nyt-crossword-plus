import assert from 'assert';

import { Graph, GraphDateEntry } from 'types';

import { getLongestStreak } from '.';

describe('helpers/stats.ts', function () {
  describe('getLongestStreak', function () {
    type TestData = [string[][], number, string[]];
    const td: TestData[] = [
      [
        [
          ['A'],
          ['A'],
          ['A'],
        ],
        3,
        ['A'],
      ],
      [
        [
          ['A'],
          ['A'],
          ['B', 'A'],
          ['B'],
          ['B'],
        ],
        3,
        ['A', 'B'],
      ],
      [
        [
          ['A'],
          ['C', 'B'],
          ['A'],
        ],
        1,
        ['A', 'B', 'C'],
      ],
      [
        [
          ['A'],
          ['A'],
          ['B'],
          ['A'],
          ['A'],
          ['A'],
        ],
        3,
        ['A',],
      ],
    ];

    td.forEach(([bestTimeUsernamesByDate, duration, usernames]) => {
      it(`should return ${duration} for ${usernames.join(', ')}`, function () {
        const longestStreak = getLongestStreak(bestTimeUsernamesByDate);
        assert.equal(longestStreak.duration, duration);
        assert.deepEqual(longestStreak.usernames.sort(), usernames.sort());
      });
    });
  });
});

