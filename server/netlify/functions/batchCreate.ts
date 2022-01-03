import { Handler } from '@netlify/functions';
// import faunadb from 'faunadb';
// import { isEmpty } from 'lodash';

import { validResponse, errorResponse } from '../api';
import { getFaunaClient, readTimesByDate, insertTimes } from '../db';
import { TimeEntry, TimeByDateIndexDataEntry } from '../types';

// const {
//   Get
// } = faunadb.query;

type BatchCreateRequestBody = {
  entries: TimeEntry[]
};


const handler: Handler = async (event, context) => {

  if (!event.body || event.body.length === 0) {
    return errorResponse(400, `No body found on request`);
  }

  const { entries: reqEntries }: BatchCreateRequestBody = JSON.parse(event.body);

  if (!reqEntries || reqEntries.length === 0) {
    return errorResponse(400, `No entries found on request body`);
  }

  const date = reqEntries[0].date;

  const client = getFaunaClient();

  let timesByDateIndex: TimeByDateIndexDataEntry[];
  try {
    timesByDateIndex = await readTimesByDate(client, date);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to load data, ${e}`);
  }

  // filter existing
  const prevUsernames = timesByDateIndex.flat();
  const newEntries = reqEntries.filter(reqEntry => !prevUsernames.includes(reqEntry.username));

  if (newEntries.length === 0) {
    return validResponse({
      successMessage: 'No new entries',
      newEntries
    });
  }

  // insert newEntries
  try {
    await insertTimes(client, newEntries);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to insert data, ${e}`);
  }

  return validResponse({
    successMessage: 'Added new entries',
    newEntries
  });
}

export { handler };
