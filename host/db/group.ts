import { DynamoDB } from 'aws-sdk';
import { TimeEntry } from 'types';
import { convertDBTimes } from '.';

export const readGroupTimes = async (client: DynamoDB, groupName: string): Promise<TimeEntry[]> => {
  let entries: TimeEntry[];

  // NESTED DOESN'T DO ANYTHING
  await client.executeStatement({
    Statement: `SELECT * FROM "times" WHERE "username" IN (
      SELECT "username" FROM "groups" WHERE "group" = 'partitionKeyValue'
    )`
  })
  .promise()
  .then(data => {
    const times = data.Items;
    entries = convertDBTimes(times);
  })
  .catch(err => {
    throw err;
  });
  return entries;
}

export const readGroupTimesOnDate = async (client: DynamoDB, groupName: string, date: string): Promise<TimeEntry[]> => {
  let entries: TimeEntry[];
  await client.executeStatement({
    Statement: `SELECT * FROM times WHERE date = DATE('${date}') AND username IN (
      SELECT username FROM groups WHERE group = '${groupName}'
      )`
  })
  .promise()
  .then(data => {
    const times = data.Items;
    entries = convertDBTimes(times);
  })
  .catch(err => {
    throw err;
  });
  return entries;
}

// TODO: export const readGroupTimesInRange = async (client: DynamoDB, groupName: string, startDate: string, endDate: string)
