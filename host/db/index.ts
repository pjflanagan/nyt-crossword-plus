

import aws, { DynamoDB } from "aws-sdk";
import { TimeEntry } from "types";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env

export const getClient = async (
  accessKeyId = AWS_ACCESS_KEY_ID,
  secretAccessKey = AWS_SECRET_ACCESS_KEY,
  region = AWS_REGION): Promise<DynamoDB> => {  
  aws.config.update({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region,
  });
  return new aws.DynamoDB();
}

export const convertDBTimes = (dbTimes: any): TimeEntry[] => {
  return dbTimes.map(e => ({
    username: e.username.S,
    time: parseInt(e.time.N),
    date: e.date.S,
  }) as TimeEntry);
}

export * from './times';
export * from './group';
