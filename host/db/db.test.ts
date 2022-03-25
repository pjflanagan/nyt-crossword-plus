
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
          process.env.AWS_ACCESS_KEY_ID,
          process.env.AWS_SECRET_ACCESS_KEY,
          process.env.AWS_REGION
        );
        const count = await getCountOfTimesOnDate(client, date);
        assert.equal(count, entryCount);
      });
    });
  });
});