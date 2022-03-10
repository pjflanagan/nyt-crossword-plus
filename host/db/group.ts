import { DynamoDB } from 'aws-sdk';
import { TimeEntry } from 'types';

export const readGroupTimes = async (client: DynamoDB, groupName: string): Promise<TimeEntry[]> => {
  let times: TimeEntry[];
  await client.executeStatement({
    Statement: `SELECT * FROM times WHERE username IN (
        SELECT username FROM group_members WHERE group = '${groupName}'
      )`
  })
  .promise()
  .then(data => {
    times = data.Items as TimeEntry[];
  })
  .catch(err => {
    throw err;
  });
  return times;
}

export const readGroupTimesOnDate = async (client: DynamoDB, groupName: string, date: string): Promise<TimeEntry[]> => {
  let times: TimeEntry[];
  await client.executeStatement({
    Statement: `SELECT * FROM times WHERE date = DATE('${date}') AND username IN (
      SELECT username FROM group_members WHERE group = '${groupName}'
      )`
  })
  .promise()
  .then(data => {
    times = data.Items as TimeEntry[];
  })
  .catch(err => {
    throw err;
  });
  return times;
}

// TODO: export const readGroupTimesInRange = async (client: DynamoDB, groupName: string, startDate: string, endDate: string)
