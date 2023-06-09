import * as cdk from 'aws-cdk-lib';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import 'dotenv/config';

const API_PATH = 'products';
const API_ROUTE = `/${API_PATH}`;
const app = new cdk.App();
const stack = new cdk.Stack(app, 'ProductServiceStack', {
  env: {
    region: process.env.PRODUCT_AWS_REGION || 'eu-west-1',
  },
});
const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PG_HOST: process.env.PG_HOST || '',
    PG_PORT: process.env.PG_PORT || '5432',
    PG_DB: process.env.PG_DB || '',
    PG_USER: process.env.PG_USER || '',
    PG_PASSWORD: process.env.PG_PASSWORD || '',
  },
  bundling: {
    externalModules: [
      'mysql',
      'mysql2',
      'better-sqlite3',
      'sqlite3',
      'tedious',
      'pg-query-stream',
      'better-sqlite3',
      'oracledb',
    ],
  },
};
const getProductsList = new NodejsFunction(stack, 'GetProductsListLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsList',
  entry: 'src/handlers/get-products-list.ts',
});
const getProductsById = new NodejsFunction(stack, 'GetProductsByIdLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsById',
  entry: 'src/handlers/get-products-by-id.ts',
});
const createProduct = new NodejsFunction(stack, 'CreateProductLambda', {
  ...sharedLambdaProps,
  functionName: 'createProduct',
  entry: 'src/handlers/create-product.ts',
});
const api = new apiGateway.HttpApi(stack, 'ProductApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration(
    'GetProductsListIntegration',
    getProductsList,
  ),
  path: API_ROUTE,
  methods: [apiGateway.HttpMethod.GET],
});
api.addRoutes({
  integration: new HttpLambdaIntegration(
    'GetProductsByIdIntegration',
    getProductsById,
  ),
  path: `${API_ROUTE}/{productId}`,
  methods: [apiGateway.HttpMethod.GET],
});
api.addRoutes({
  integration: new HttpLambdaIntegration(
    'CreateProductIntegration',
    createProduct,
  ),
  path: API_ROUTE,
  methods: [apiGateway.HttpMethod.POST],
});

new cdk.CfnOutput(stack, 'ApiUrl', {
  value: `${api.url}${API_PATH}` ?? 'Something went wrong with the deployment.',
});
