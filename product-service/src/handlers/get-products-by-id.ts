import { availableProducts } from '../mocks/data';
import { buildResponse } from './utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.productId;

    if (!id) {
      return buildResponse(404, 'Product not found');
    }

    const product = availableProducts.find((product) => product.id === id);

    if (!product) {
      return buildResponse(404, 'Product not found');
    }

    return buildResponse(200, product);
  } catch (error) {
    return buildResponse(500, error);
  }
};
