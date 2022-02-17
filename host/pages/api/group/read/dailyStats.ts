
import { filter, isEmpty, mean, orderBy } from 'lodash';

import { TimeEntry } from 'types';
import { getClient, readGroupTimesOnDate } from 'db';
import { getPlacedEntries, formatTimeMMSS } from 'helpers';

// /api/dailyStats?groupName=<GROUP_NAME>&date=<YYYY-MM-DD>

const handler = async (req, res) => {
  const { groupName, date } = req.query;

  // error check
  if (isEmpty(groupName)) {
    return res.status(400).json({ errorMessage: `Query parameter (groupName) is required` });
  } else if (isEmpty(date)) {
    return res.status(400).json({ errorMessage: `Query parameter (date) is required` });
  }

  // run query
  const client = getClient();
  let entries: TimeEntry[];
  try {
    entries = await readGroupTimesOnDate(client, groupName, date);
    await client.end();
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  } 

  if (entries.length === 0) {
    return res.status(400).json({ errorMessage: `No entries for today` });
  }

  // get the stats
  const placedEntries = getPlacedEntries(orderBy(entries, 'time'));
  const winners = filter(placedEntries, (e) => e.place <= 3).map(e => ({
    place: e.place,
    time: formatTimeMMSS(e.time),
    username: e.username
  }));
  const aveTime = mean(entries.map(e => e.time));

  // respond
  return res.status(200).json({
    winners,
    groupAverageTime: formatTimeMMSS(aveTime)
  });
}

export default handler;
