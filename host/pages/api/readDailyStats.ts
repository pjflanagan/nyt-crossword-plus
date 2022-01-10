

import { filter, isEmpty, mean, orderBy } from 'lodash';
import { TimeEntry } from '../../types';

import { getClient, readGroupTimesOnDate } from '../../db';
import { getPlacedEntries, formatTime } from '../../helpers';

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
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  }

  // get the stats
  const placedEntries = getPlacedEntries(orderBy(entries, 'time'));
  const winners = filter(placedEntries, (e) => e.place <= 3).map(e => ({
    place: e.place,
    time: formatTime(e.time),
    username: e.username
  }));
  const aveTime = mean(entries.map(e => e.time));

  // respond
  res.status(200).json({
    winners,
    groupAverageTime: formatTime(aveTime)
  });
}

export default handler;
