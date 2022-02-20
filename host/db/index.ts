

import { Client } from 'pg';

const BITIO_USERNAME = process.env.BITIO_USERNAME || '';
const BITIO_PASSWORD = process.env.BITIO_PASSWORD || '';

// Create a client using the connection information provided on bit.io.
export const getClient = async (): Promise<Client> => {
  const client: Client = new Client({
    user: BITIO_USERNAME,
    host: 'db.bit.io',
    database: 'bitdotio',
    password: BITIO_PASSWORD,
    port: 5432,
  });
  await client.connect();
  return client;
}

// TODO: move to env
export const DB_NAME = `"pjflanagan/nyt_crossword_plus"`

export * from './times';
export * from './group';
