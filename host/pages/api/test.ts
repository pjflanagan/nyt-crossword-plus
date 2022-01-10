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
  const players = NAMES.map(name => ({
    name,
    weight: Math.floor(Math.random() * 20)
  }));

  const entries = [];
  for (
    let date = moment().subtract(entryCount, 'days');
    date.isBefore(moment());
    date.add(1, 'day')
  ) {
    const dateEntries = sampleSize(players, 6).map((player) => {
      let baseTime = 10 + player.weight;
      if (date.format('dddd') === 'Saturday') {
        baseTime += 30;
      }

      return {
        username: player.name,
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
