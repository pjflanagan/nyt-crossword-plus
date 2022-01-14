
import { Client } from 'pg';

import { DB_NAME } from '.';

export const readGroupTimes = async (client: Client, groupName: string) => {
  const result = await client.query(`
    SELECT * FROM ${DB_NAME}."times" WHERE "username" IN (
      SELECT username FROM ${DB_NAME}."group_members" WHERE "group" = '${groupName}'
    );
  `);
  return result.rows;
}

export const readGroupTimesInRange = async (client: Client, groupName: string, startDate: string, endDate: string) => {
  const result = await client.query(`
    SELECT * FROM ${DB_NAME}."times"
    WHERE "date" >= DATE('${startDate}')
      AND "date" <= DATE('${endDate}')
      AND "username" IN (
        SELECT username FROM ${DB_NAME}."group_members" WHERE "group" = '${groupName}'
      );
  `);
  return result.rows;
}

export const readGroupTimesOnDate = async (client: Client, groupName: string, date: string) => {
  const result = await client.query(`
    SELECT * FROM ${DB_NAME}."times" WHERE "date" = DATE('${date}') AND "username" IN (
      SELECT username FROM ${DB_NAME}."group_members" WHERE "group" = '${groupName}'
    );
  `);
  return result.rows;
}