import { Handler } from '@netlify/functions';
import { isEmpty } from 'lodash';

import { errorResponse } from '../api';

const FAUNA_ACCESS_TOKEN = process.env.FAUNA_ACCESS_TOKEN;

const handler: Handler = async (event, context) => {
  const { time } = event.queryStringParameters;

  // read 

  return {
    statusCode: 200,
    body: JSON.stringify({ time })
  };
}

export { handler };
