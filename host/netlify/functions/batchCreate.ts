import { Handler } from '@netlify/functions';

import { validResponse, errorResponse } from '../api';
import { getFaunaClient, readTimesByDate, writeTimes } from '../db';
import { TimeEntry, TimeByDateIndexDataEntry } from '../../types';

type BatchCreateRequestBody = {
  entries: TimeEntry[]
};

const handler: Handler = async (event, context) => {

  // validate there is a request body
  if (!event.body || event.body.length === 0) {
    return errorResponse(400, `No body found on request`);
  }

  // get data from request
  const { entries: reqEntries }: BatchCreateRequestBody = JSON.parse(event.body);
  if (!reqEntries || reqEntries.length === 0) {
    return errorResponse(400, `No entries found on request body`);
  }
  const date = reqEntries[0].date;

  // read existing times from fauna
  const client = getFaunaClient();
  let timesByDateIndex: TimeByDateIndexDataEntry[];
  try {
    timesByDateIndex = await readTimesByDate(client, date);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to load data, ${e}`);
  }

  // filter existing from new request
  const prevUsernames = timesByDateIndex.flat();
  const newEntries = reqEntries.filter(reqEntry => !prevUsernames.includes(reqEntry.username));

  // if there are no new entries, respond early
  if (newEntries.length === 0) {
    return validResponse({
      successMessage: 'No new entries',
      newEntries
    });
  }

  // otherwise, insert newEntries
  try {
    await writeTimes(client, newEntries);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to insert data, ${e}`);
  }

  // respond
  return validResponse({
    successMessage: 'Added new entries',
    newEntries
  });
}

export { handler };
