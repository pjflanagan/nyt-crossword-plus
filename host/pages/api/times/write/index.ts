
import { getClient, getUsernamesWhoHavePlayedOnDate, writeTimes } from 'db';
import { TimeEntry } from 'types';

const WRITE_API_KEY = process.env.WRITE_API_KEY;

/*
TODO: headers
https://css-tricks.com/accessing-data-netlify-functions-react/
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", 
*/

type BatchCreateRequestBody = {
  entries: TimeEntry[]
};

const handler = async (req, res) => {
  console.log(`New batch create request`);
  const { k } = req.query;

  // access check
  if (!k || k === '') {
    console.error(`Write API key is missing`);
    return res.status(403).json({ errorMessage: `Write API key is missing` });
  } else if (k !== WRITE_API_KEY) {
    console.error(`Write API key is incorrect`);
    return res.status(403).json({ errorMessage: `Write API key is incorrect` });
  }
  console.log(`Access check passsed`);

  // validate there is a request body
  if (!req.body || req.body.length === 0) {
    console.error(`No body found on request`);
    return res.status(400).json({ errorMessage: `No body found on request` });
  }

  // get data from request
  const { entries: reqEntries }: BatchCreateRequestBody = JSON.parse(req.body);
  if (!reqEntries || reqEntries.length === 0) {
    console.error(`No entries found on request body`);
    return res.status(400).json({ errorMessage: `No entries found on request body` });
  }
  console.log(`Request body validation passed`);

  const date = reqEntries[0].date;

  // read existing times from fauna
  console.log(`Loading previous entries for ${date}`);
  const client = await getClient();
  let prevUsernames: string[];
  try {
    prevUsernames = await getUsernamesWhoHavePlayedOnDate(client, date);
  } catch (e) {
    console.error(`Unable to load previous entries for date ${date}`);
    client.end();
    return res.status(500).json({ errorMessage: `DB Error: unable to load previous entries, ${e}` });
  }

  // filter existing from new request
  let newEntries = [];
  if (prevUsernames.length > 0) {
    console.log(`Filtering previous entries for ${date}`);
    newEntries = reqEntries.filter(reqEntry => !prevUsernames.includes(reqEntry.username));
  } else {
    console.log(`No previous entries for ${date} to filter`);
    newEntries = reqEntries;
  }

  // if there are no new entries, respond early
  if (newEntries.length === 0) {
    console.log(`No new entries for date ${date}`);
    client.end();
    return res.status(200).json({
      newEntries
    });
  }

  // otherwise, insert newEntries
  console.log(`Writing new times for date ${date}`);
  try {
    await writeTimes(client, newEntries);
    client.end();
  } catch (e) {
    console.error(`Unable to write times for ${date}`);
    return res.status(500).json({ errorMessage: `DB Error: unable to insert data, ${e}` });
  }

  // respond
  console.log(`Added times for date ${date}`);
  return res.status(200).json({
    successMessage: `Added new entries`,
    newEntries
  });
}

export default handler;
