
import { DynamoDB } from "aws-sdk";

import { TimeEntry } from 'types';

import { convertDBTimes } from ".";

// READ

export const getCountOfTimesOnDate = async (client: DynamoDB, date: string): Promise<number> => {
  const entries = await getEntriesOnDate(client, date);
  return entries.length;
}

export const getUsernamesWhoHavePlayedOnDate = async (client: DynamoDB, date: string): Promise<string[]> => {
  const entries = await getEntriesOnDate(client, date);
  return entries.map(e => e.username);
}

export const getEntriesOnDate = async (client: DynamoDB, date: string): Promise<TimeEntry[]> => {
  let entries: TimeEntry[];
  await client.batchGetItem({
    RequestItems: {
      'times': {
        Keys: [
          {
            date: {
              S: date
            },
          },
        ],
      },
    },
  })
  .promise()
  .then(data => {
    const { times } = data.Responses;
    entries = convertDBTimes(times);
  })
  .catch(err => {
    throw err;
  });
  return entries;
}

// WRITE

export const writeTimes = async (client: DynamoDB, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  await Promise.all(
    entries.map(e => {
      client.putItem({
        TableName: 'times',
        Item: {
          'username': {
            S: e.username
          },
          'date': {
            S: e.date
          },
          'time': {
            N: `${e.time}`
          },
        }
      })
    })
  );
  return;
}

export const deleteTimes = async (client: DynamoDB, entries: TimeEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return;
  }
  await Promise.all(entries.map(e => {
    client.deleteItem({
      TableName: 'times',
      Key: {
        'username': {
          S: e.username
        },
        date: {
          S: e.date
        }
      },
    })
  }));
  return;
}