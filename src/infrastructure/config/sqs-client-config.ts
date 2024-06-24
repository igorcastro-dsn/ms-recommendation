import AWS from 'aws-sdk';

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_HOST || 'http://localhost:4566'
});

export { sqs };
