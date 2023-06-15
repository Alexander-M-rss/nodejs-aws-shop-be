import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import 'dotenv/config';

const BUCKET_NAME = process.env.BUCKET_NAME || '';
const IMPORT_AWS_REGION = process.env.IMPORT_AWS_REGION || 'eu-west-1';
const API_PATH = 'import';
const app = new cdk.App();
const stack = new cdk.Stack(app, 'ImportServiceStack', {
  env: {
    region: IMPORT_AWS_REGION,
  },
});
const bucket = new s3.Bucket(stack, 'MyShopImportBucket', {
  bucketName: BUCKET_NAME,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  blockPublicAccess: new s3.BlockPublicAccess({
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  }),
  cors: [
    {
      allowedHeaders: ['*'],
      allowedOrigins: ['*'],
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
    },
  ],
});
const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    IMPORT_AWS_REGION,
    BUCKET_NAME,
  },
};
const importProductsFile = new NodejsFunction(
  stack,
  'ImportProductsFileLambda',
  {
    ...sharedLambdaProps,
    functionName: 'importProductsFile',
    entry: 'src/handlers/import-products-file.ts',
  },
);
const api = new apiGateway.RestApi(stack, 'ImportApi', {
  defaultCorsPreflightOptions: {
    allowHeaders: ['*'],
    allowOrigins: apiGateway.Cors.ALL_ORIGINS,
    allowMethods: apiGateway.Cors.ALL_METHODS,
  },
});

bucket.grantReadWrite(importProductsFile);
api.root
  .addResource(API_PATH)
  .addMethod('GET', new apiGateway.LambdaIntegration(importProductsFile), {
    requestParameters: { 'method.request.querystring.name': true },
  });
