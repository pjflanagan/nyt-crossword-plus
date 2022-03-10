import { isEmpty } from 'lodash';

import { TimeEntry } from 'types';
import { getClient, readGroupTimes } from 'db';

// v3: put the password on this
const handler = async (req, res) => {
  const { groupName } = req.query;

  // error check
  if (isEmpty(groupName)) {
    return res.status(400).json({ errorMessage: `Query parameter (groupName) is required` });
  }

  // run query
  const client = await getClient();
  let entries: TimeEntry[];
  try {
    entries = await readGroupTimes(client, groupName);
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  }

  // respond
  return res.status(200).json({
    entries
  });
}

export default handler;
