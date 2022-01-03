import { Handler } from '@netlify/functions';
import { isEmpty } from 'lodash';

import { validResponse, errorResponse } from '../api';
import { getFaunaClient, readTimesByDate } from '../db';

type ReadQueryParameters = {
  date: string;
}

const handler: Handler = async (event, context) => {
  const { date } = event.queryStringParameters as ReadQueryParameters;

  // error check
  if (isEmpty(date)) {
    return errorResponse(400, `Query parameter (date) is required`);
  }

  // run query
  const client = getFaunaClient();
  let entries;
  try {
    entries = await readTimesByDate(client, date);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to load data, ${e}`);
  }

  // respond
  return validResponse({
    entries
  });
}

export { handler };
