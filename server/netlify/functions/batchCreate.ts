import { Handler } from '@netlify/functions';
import { isEmpty } from 'lodash';

import { errorResponse } from '../api';
import { CreateRequestBody } from './create';

type BatchCreateRequestBody = CreateRequestBody[];

const handler: Handler = async (event, context) => {
  const batchCreateRequest: BatchCreateRequestBody = JSON.parse(event.body);

  // if (isEmpty(lat) || isEmpty(lon)) {
  //   return errorResponse({
  //     statusCode: 400,
  //     message: `Both lat (${lat}) and lan (${lon}) are required.`
  //   });
  // }

  // run query

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
}

export { handler };
