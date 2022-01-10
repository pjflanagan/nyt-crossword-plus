
import { Client } from 'pg';

export const readGroupTimes = async (client: Client, groupName: string) => {
  const result = await client.query(`
    SELECT * FROM "pjflanagan/nyt_crossword_plus"."times" WHERE "username" IN (
      SELECT username FROM "pjflanagan/nyt_crossword_plus"."group_members" WHERE "group" = '${groupName}'
    );
  `);
  return result.rows;
}
