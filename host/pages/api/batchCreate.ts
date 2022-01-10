
import { getClient, getUsernamesWhoHavePlayedOnDate, writeTimes } from '../../db';
import { TimeEntry } from '../../types';

const WRITE_API_KEY = process.env.WRITE_API_KEY;

type BatchCreateRequestBody = {
  entries: TimeEntry[]
};

const handler = async (req, res) => {
  const { k } = req.query;

  // access check
  if (!k || k === '') {
    return res.status(403).json({ errorMessage: `Write API key is missing` });
  } else if (k !== WRITE_API_KEY) {
    return res.status(403).json({ errorMessage: `Write API key is incorrect` });
  }

  // validate there is a request body
  if (!req.body || req.body.length === 0) {
    return res.status(400).json({ errorMessage: `No body found on request` });
  }

  // get data from request
  const { entries: reqEntries }: BatchCreateRequestBody = JSON.parse(req.body);
  if (!reqEntries || reqEntries.length === 0) {
    return res.status(400).json({ errorMessage: `No entries found on request body` });
  }
  const date = reqEntries[0].date;

  // read existing times from fauna
  const client = getClient();
  let prevUsernames: string[];
  try {
    prevUsernames = await getUsernamesWhoHavePlayedOnDate(client, date);
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  }

  // filter existing from new request
  const newEntries = reqEntries.filter(reqEntry => !prevUsernames.includes(reqEntry.username));

  // if there are no new entries, respond early
  if (newEntries.length === 0) {
    return res.status(200).json({
      newEntries
    });
  }

  // otherwise, insert newEntries
  try {
    await writeTimes(client, newEntries);
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to insert data, ${e}` });
  }

  // respond
  return res.status(200).json({
    successMessage: 'Added new entries',
    newEntries
  });
}

export default handler;
