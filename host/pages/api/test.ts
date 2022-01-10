import moment from 'moment';
import { sampleSize } from 'lodash';

const NAMES = [
  'Iron Man',
  'Spider-Man',
  'Hulk',
  'Hawkeye',
  'Scarlet Witch',
  'Black Widow',
  'Captain America',
  'Starlord'
];

export default function handler(_req, res) {
  const entryCount = Math.floor(Math.random() * 100) + 100;

  // v2: set random intelligence modifiers on each name

  const entries = [];
  for (
    let date = moment().subtract(entryCount, 'days');
    date.isBefore(moment());
    date.add(1, 'day')
  ) {
    const dateEntries = sampleSize(NAMES, 6).map((username) => {
      let baseTime = 10;
      if (date.format('dddd') === 'Saturday') {
        baseTime = 40;
      }

      return {
        username,
        date: date.format('YYYY-MM-DD'),
        time: Math.floor(Math.random() * 48 + baseTime)
      };
    });
    entries.push(...dateEntries);
  }

  return res.status(200).json({
    entries,
  });
}
