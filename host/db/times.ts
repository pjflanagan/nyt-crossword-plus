
import { Client } from 'pg';
import { flatten } from 'lodash';

import { TimeEntry } from '../types';

export const getUsernamesWhoHavePlayedOnDate = async (client: Client, date: string): Promise<string[]> => {
  const result = await client.query({
    rowMode: 'array',
    text: `SELECT username FROM "pjflanagan/nyt_crossword_plus"."times" WHERE "date"=DATE('${date}');`
  });
  return flatten(result.rows);
}

export const writeTimes = async (client: Client, entries: TimeEntry[]) => {
  return await client.query(`
    INSERT INTO "pjflanagan/nyt_crossword_plus"."times" ("username", "date", "time")
    VALUES ${entries.map(e => `('${e.username}', '${e.date}', ${e.time})`).join(',')};
  `);
}
