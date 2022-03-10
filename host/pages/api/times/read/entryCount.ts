

import { isEmpty } from 'lodash';

import { getClient, getCountOfTimesOnDate } from 'db';

const handler = async (req, res) => {
  const { date } = req.query;

  // error check
  if (isEmpty(date)) {
    return res.status(400).json({ errorMessage: `Query parameter (date) is required` });
  }

  // run query
  const client = await getClient();
  let count: number;
  try {
    count = await getCountOfTimesOnDate(client, date);
    client.end();
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  }

  // respond
  return res.status(200).json({
    entryCount: count,
    hasEntries: count > 0
  });
}

export default handler;
