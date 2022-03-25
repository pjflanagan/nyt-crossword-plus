
import assert from 'assert';

import { getClient, getCountOfTimesOnDate } from '.';

type TestData = [string, number];

describe('db/time.ts', function () {
  describe('getCountOfTimesOnDate', function () {
    const td: TestData[] = [
      ['2022-01-01', 1],
      // ['2022-01-11', 3]
    ];

    td.forEach(([date, entryCount]) => {
      it(`should return ${entryCount} for ${date}`, async function () {
        const client = await getClient(
          // TODO: don't expose this

        );
        const count = await getCountOfTimesOnDate(client, date);
        assert.equal(count, entryCount);
      });
    });
  });
});

