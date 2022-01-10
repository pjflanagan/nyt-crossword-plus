
import { Client } from 'pg';

import { TimeEntry } from '../types';

export const getUsernamesWhoHavePlayedOnDate = async (client: Client, date: string) => {
  return await client.query(`
    SELECT username FROM "pjflanagan/nyt_crossword_plus"."times" WHERE "date"='${date}';
  `);
}

export const writeTimes = async (client: Client, entries: TimeEntry[]) => {
  return await client.query(`
    INSERT INTO "pjflanagan/nyt_crossword_plus"."times" ("username", "date", "time")
    VALUES ${entries.map(e => `('${e.username}', '${e.date}', ${e.time})`).join(',')};
  `);
}
