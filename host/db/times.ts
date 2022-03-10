
import { DynamoDB } from "aws-sdk";

import { TimeEntry } from 'types';

// READ

export const getCountOfTimesOnDate = async (client: DynamoDB, date: string): Promise<number> => {
  const entries = await getEntriesOnDate(client, date);
  return entries.length;
}

export const getUsernamesWhoHavePlayedOnDate = async (client: DynamoDB, date: string): Promise<string[]> => {
  const entries = await getEntriesOnDate(client, date);
  return entries.map(e => e[0]);
}

export const getEntriesOnDate = async (client: DynamoDB, date: string): Promise<[string, number][]> => {
  let entries: [string, number][];
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
    entries = times.map(e => [e.username.S, parseInt(e.time.N)]);
  })
  .catch(err => {
    throw err;
  });
  return entries;
  // const result = await client.executeStatement({
  //   Statement: `SELECT username, time FROM times WHERE "date"='${date}'`
  // })
  // return result.Items.map(item => [item.username.S, parseInt(item.time.N)]);
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