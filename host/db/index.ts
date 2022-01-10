

import { Client } from 'pg';

const BITIO_USERNAME = process.env.BITIO_USERNAME || '';
const BITIO_PASSWORD = process.env.BITIO_PASSWORD || '';

// Create a client using the connection information provided on bit.io.
export const getClient = (): Client => {
  const client = new Client({
    user: BITIO_USERNAME,
    host: 'db.bit.io',
    database: 'bitdotio',
    password: BITIO_PASSWORD,
    port: 5432,
  });
  client.connect();
  return client;
}

export * from './times';
export * from './group';
