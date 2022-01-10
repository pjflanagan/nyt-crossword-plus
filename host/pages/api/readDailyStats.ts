

/*
  json: {
    winners: [
      { name: 'Tony', time: '0:23' },
      { name: 'Steve, Bucky', time: '0:22' },
      { name: 'Wanda', time: '0:36' },
    ],
    groupAverageTime: '0:41'
  }

  If not no response or error response: send nothing
  otherwise format and reply with:

  Congratulations to the MMM DD winners:
  1. Tony - 0:23
  2. Steve, Bucky - 0:29
  3. Wanda - 0:36

  The group's average time was 0:41.

  Click here to play today's crossword!
*/

import { filter, isEmpty, mean, orderBy } from 'lodash';
import { TimeEntry } from '../../types';

import { getClient, readGroupTimesOnDate } from '../../db';
import { getPlacedEntries } from '../../components/group/helpers';

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
    time: e.time,
    username: e.username
  }));
  const groupAverageTime = mean(entries.map(e => e.time));

  // respond
  res.status(200).json({
    winners,
    groupAverageTime
  });
}

export default handler;
