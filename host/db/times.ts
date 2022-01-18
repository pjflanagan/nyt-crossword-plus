
import { Client } from 'pg';
import { flatten } from 'lodash';

import { TimeEntry } from 'types';

import { DB_NAME } from '.';

export const getCountOfTimesOnDate = async (client: Client, date: string): Promise<string[]> => {
  const result = await client.query({
    rowMode: 'array',
    text: `SELECT COUNT(*) FROM ${DB_NAME}."times" WHERE "date"=DATE('${date}');`
  });
  return flatten(result.rows);
}

export const getUsernamesWhoHavePlayedOnDate = async (client: Client, date: string): Promise<string[]> => {
  const result = await client.query({
    rowMode: 'array',
    text: `SELECT username FROM ${DB_NAME}."times" WHERE "date"=DATE('${date}');`
  });
  return flatten(result.rows);
}

export const writeTimes = async (client: Client, entries: TimeEntry[]) => {
  return await client.query(`
    INSERT INTO ${DB_NAME}."times" ("username", "date", "time")
    VALUES ${entries.map(e => `('${e.username}', '${e.date}', ${e.time})`).join(',')};
  `);
}
