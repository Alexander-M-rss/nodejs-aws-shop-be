import { availableProducts } from '../mocks/data';
import { buildResponse } from './utils';
import { APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    return buildResponse(200, availableProducts);
  } catch (error) {
    return buildResponse(500, error);
  }
};
