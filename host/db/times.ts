
import { Client } from 'pg';
import { flatten } from 'lodash';

import { TimeEntry } from 'types';

import { DB_NAME } from '.';

// READ

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

export const getEntriesOnDate = async (client: Client, date: string): Promise<[string, number][]> => {
  const result = await client.query({
    rowMode: 'array',
    text: `SELECT username, time FROM ${DB_NAME}."times" WHERE "date"=DATE('${date}');`
  });
  return result.rows as [string, number][];
}

// WRITE

export const writeTimes = async (client: Client, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  await client.query(`
    INSERT INTO ${DB_NAME}."times" ("username", "date", "time")
    VALUES ${entries.map(e => `('${e.username}', '${e.date}', ${e.time})`).join(',')};
  `);
  return;
}

export const writeTimesSequentially = async (client: Client, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  for (let i = 0; i < entries.length; ++i ){
    const entry = entries[i];
    try {
      await client.query(`
        INSERT INTO ${DB_NAME}."times" ("username", "date", "time")
        VALUES ('${entry.username}', '${entry.date}', ${entry.time});
      `);
      console.log(`SUCCESS: Insert ${entry.username} - ${entry.time} on ${entry.date}`);

    } catch {
      console.error(`FAILURE: Insert ${entry.username} - ${entry.time} on ${entry.date}`);
    }
  }

  return;
}

export const updateTimes = async (client: Client, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  const updateQueries = entries.map((e) => {
    return client.query(`
        UPDATE ${DB_NAME}."times"
        SET "time" = ${e.time}
        WHERE "username" = '${e.username}' AND "date" = '${e.date}';
      `);
  })
  await Promise.all(updateQueries);
  return;
}

export const deleteTimes = async (client: Client, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  const updateQueries = entries.map((e) => {
    return client.query(`
        DELETE FROM ${DB_NAME}."times"
        WHERE "username" = '${e.username}' AND "date" = '${e.date}';
      `);
  })
  await Promise.all(updateQueries);
  return;
}