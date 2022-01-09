import faunadb from 'faunadb';

import { TimeEntry, TimeByDateIndex, TimeEntryData, CacheUpdate } from '../../types';

const {
  Paginate,
  Match,
  Index,
  Collection,
  Update,
  Ref
} = faunadb.query;

// Read

export const readCachedGroupTimes = async (client: faunadb.Client, groupName: string) => {
  const entry: TimeEntryData = await client.query(
    Paginate(
      Match(
        Index('group_cached_times_by_group_name'),
        groupName
      )
    )
  );
  return entry.data;
}

export const getCacheReadWriteTimestamps = async (client: faunadb.Client, groupName: string): Promise<CacheUpdate> => {
  const results = client.query([
    Paginate(
      Match(
        Index('latest_times_write_timestamp')
        // TODO: instead get the latest from times entry ts/1000
        // then we can delete this index and table
      )
    ),
    Paginate(
      Match(
        Index('group_latestGroupReadTimestamp__by__groupName'),
        // TODO: instead get the ts/1000 from the cache data
        // then we can delete the latestGroupReadTimestamp field
        groupName
      )
    )
  ]);

  return {
    latestTimesWriteTimestamp: results[0],
    latestGroupReadTimestamp: results[1]
  };
}

// Write

export const writeCachedGroupEntries = async (client: faunadb.Client, groupName: string, entries: TimeEntry[]) => {
  await client.query(
    Update(
      Ref(
        Match(
          Index('group_cache_ref__by__groupName'),
          groupName
        )
      ),
      {
        data: {
          groupName,
          latestGroupReadTimestamp: new Date().getTime(),
          entries
        }
      }
    )
  );
}
