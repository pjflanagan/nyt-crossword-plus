import { Handler } from '@netlify/functions';
import { isEmpty } from 'lodash';

import type { CacheUpdate, TimeEntry } from '../../types';

import { validResponse, errorResponse } from '../api';
import { getFaunaClient, readGroupTimes, readCachedGroupTimes, writeCachedGroupEntries, getCacheReadWriteTimestamps } from '../db';

type ReadQueryParameters = {
  groupName: string;
}

// v2: put the password on this
const handler: Handler = async (event, context) => {
  const { groupName } = event.queryStringParameters as ReadQueryParameters;

  // error check
  if (isEmpty(groupName)) {
    return errorResponse(400, `Query parameter (groupName) is required`);
  }

  // client
  const client = getFaunaClient();

  // get the last update time
  let cacheUpdate: CacheUpdate;
  try {
    // read latest_times_write_timestamp and group_time_cache
    cacheUpdate = await getCacheReadWriteTimestamps(client, groupName);
  } catch (e) {
    return errorResponse(500, `DB Error: unable to load cache update times, ${e}`);
  }

  // if the last update time is more recent than the last load time for this group: load the new data and update the cache 
  // otherwise load from the cache
  let entries: TimeEntry[];
  if (cacheUpdate.latestTimesWriteTimestamp > cacheUpdate.latestGroupReadTimestamp) {
    try {
      // read the new group times
      entries = await readGroupTimes(client, groupName);
    } catch (e) {
      return errorResponse(500, `DB Error: unable to read new group times, ${e}`);
    }
    try {
      // update the group's cache and last load time
      writeCachedGroupEntries(client, groupName, entries);
    } catch (e) {
      console.log(`DB Error: unable to update cache, ${e}`)
    }
  } else {
    try {
      entries = await readCachedGroupTimes(client, groupName);
    } catch (e) {
      return errorResponse(500, `DB Error: unable to load cached data, ${e}`);
    }
  }

  // respond
  return validResponse({
    entries
  });
}

export { handler };
