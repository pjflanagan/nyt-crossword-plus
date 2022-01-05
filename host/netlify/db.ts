import faunadb from 'faunadb';

import { TimeEntry, TimeByDateIndex } from '../types';

const {
  Paginate,
  Match,
  Index,
  Map,
  Lambda,
  Var,
  Collection,
  Create,
  Join,
  Select,
  Get
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
  const entry: TimeByDateIndex = await client.query(
    Paginate(
      Match(
        Index('times_by_date'),
        date
      )
    )
  );
  return entry.data;
}

export const readGroupByName = async (client: faunadb.Client, name: string) => {
  const entry: TimeByDateIndex = await client.query(
    Paginate(
      Match(
        Index('group_by_name'),
        name
      )
    )
  );
  return entry.data;
}

export const readGroupTimes = async (client: faunadb.Client, groupName: string) => {
  const entry: TimeByDateIndex = await client.query(
    Map(
      Paginate(
        Join(
          Match(Index("group_member_usernames_by_group_name"), groupName),
          Index("times_by_username")
        )
      ),
      Lambda(
        "X",
        Select("data",
          Get(Var("X"))
        )
      )
    )
  );
  return entry.data;
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