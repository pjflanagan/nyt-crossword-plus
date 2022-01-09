import faunadb from 'faunadb';

const FAUNADB_ACCESS_SECRET = process.env.FAUNADB_ACCESS_SECRET || '';

export const getFaunaClient = () => {
  return new faunadb.Client({
    secret: FAUNADB_ACCESS_SECRET,
    domain: 'db.us.fauna.com',
    // scheme: 'https',
  });
}

export * from './times';
export * from './group';
export * from './cache';
