import faunadb from 'faunadb';

import { TimeEntry, TimeByDateIndex } from './types';

const {
  Paginate,
  Match,
  Index,
  Map,
  Lambda,
  Var,
  Collection,
  Create
} = faunadb.query;

const FAUNADB_ACCESS_SECRET = process.env.FAUNADB_ACCESS_SECRET || '';

export const getFaunaClient = () => {
  return new faunadb.Client({
    secret: FAUNADB_ACCESS_SECRET,
    domain: 'db.us.fauna.com',
    // scheme: 'https',
  });
}

export const readTimesByDate = async (client: faunadb.Client, date: string) => {
  const entries: TimeByDateIndex = await client.query(
    Paginate(
      Match(
        Index('times_by_date'),
        date
      )
    )
  );
  return entries.data;
}

export const insertTimes = async (client: faunadb.Client, entries: TimeEntry[]) => {
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