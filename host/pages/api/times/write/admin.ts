
import { getClient, getEntriesOnDate, writeTimes, deleteTimes } from 'db';
import { TimeEntry } from 'types';

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

  // get the date off of the first entry (they should all be the same)
  const date = reqEntries[0].date;
  if (!date || date.length === 0) {
    return res.status(400).json({ errorMessage: `No date found on entries` });
  }

  // read existing times from fauna
  const client = await getClient();
  let prevEntries: TimeEntry[];
  try {
    prevEntries = await getEntriesOnDate(client, date);
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  }

  // filter existing from new request
  const updateEntries = [];
  const newEntries = [];
  const deleteEntries = [];
  reqEntries.forEach(reqEntry => {
    const prevEntryForUser = prevEntries.find(e => e.username === reqEntry.username);
    if (!prevEntryForUser && reqEntry.time !== 0) {
      // if there is no old entry and the new entry time isn't 0, add it to new entries
      newEntries.push(reqEntry);
    } else if (prevEntryForUser && prevEntryForUser[1] !== reqEntry.time) {
      // if there is an entry that is different than before
      if (reqEntry.time === 0) {
        // if the time is 0, consider that a delete
        deleteEntries.push(reqEntry);
      } else {
        // else that is an update
        updateEntries.push(reqEntry);
      }
    }
  });

  // if there are no new entries, respond early
  if (newEntries.length === 0 && updateEntries.length === 0 && deleteEntries.length === 0) {
    return res.status(200).json({
      errorMessage: `No new entries to add`,
      newEntries,
      updateEntries,
      deleteEntries
    });
  }

  // otherwise, insert newEntries
  try {
    await Promise.all([
      writeTimes(client, [...newEntries, ...updateEntries]),
      deleteTimes(client, deleteEntries),
    ]);
  } catch (e) {
    return res.status(500).json({ errorMessage: `DB Error: unable to insert data, ${e}` });
  }

  // respond
  return res.status(200).json({
    successMessage: 'Updated entries',
    newEntries,
    updateEntries,
    deleteEntries
  });
}

export default handler;
