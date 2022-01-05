import { Handler } from '@netlify/functions';
import { isEmpty } from 'lodash';

import { validResponse, errorResponse } from '../api';
import { getFaunaClient, readGroupTimes } from '../db';

type ReadQueryParameters = {
  groupName: string;
}

// TODO: put the password on this
const handler: Handler = async (event, context) => {
  const { groupName } = event.queryStringParameters as ReadQueryParameters;

  // error check
  if (isEmpty(groupName)) {
    return errorResponse(400, `Query parameter (groupName) is required`);
  }

  // run query
  const client = getFaunaClient();
  let entries;
  try {
    entries = await readGroupTimes(client, groupName);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to load data, ${e}`);
  }

  // respond
  return validResponse({
    entries
  });
}

export { handler };
