

import aws, { DynamoDB } from "aws-sdk";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env

export const getClient = async (): Promise<DynamoDB> => {
  aws.config.update({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: AWS_REGION,
  });
  return new aws.DynamoDB();
}

export * from './times';
export * from './group';
