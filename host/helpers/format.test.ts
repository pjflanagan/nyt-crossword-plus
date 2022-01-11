import assert from 'assert';

import { formatDate } from '.';

type TestData = [string, string];

describe('helpers/format.ts', function () {
  describe('formatDate', function () {
    const td: TestData[] = [
      ['2022-01-01', 'Jan 1'],
      ['2022-01-11T00:00:00.000Z', 'Jan 11']
    ];

    td.forEach(([dateString, formattedDateString]) => {
      it(`should return ${formattedDateString} for ${dateString}`, function () {
        assert.equal(formatDate(dateString), formattedDateString);
      });
    });
  });
});

