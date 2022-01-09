import faunadb, { Time } from 'faunadb';

import { TimeEntry, TimeByDateIndex } from '../../types';

const {
  Paginate,
  Match,
  Index,
  Map,
  Lambda,
  Var,
  Collection,
  Create,
  Update,
  Ref,
} = faunadb.query;

// TODO: should this index just be username by date?
export const readTimesByDate = async (client: faunadb.Client, date: string) => {
  const entry: TimeByDateIndex = await client.query(
    Paginate(
      Match(
        Index('time_and_username_by_date'),
        date
      )
    )
  );
  return entry.data;
}

export const writeTimes = async (client: faunadb.Client, entries: TimeEntry[]) => {
  await client.query(
    Map(
      entries,
      Lambda(
        'entry',
        Create(
          Collection('times'),
          {
            data: Var('entry')
          }
        )
      )
    )
  );
}

export const writeLatestTimesWriteTimestamp = async (client: faunadb.Client) => {
  await client.query(
    Update(
      Ref(Collection('latest_times_write_timestamp'), '320257183191138370'),
      {
        data: {
          latestTimesWriteTimestamp: new Date().getTime()
        },
      },
    )
  )
}