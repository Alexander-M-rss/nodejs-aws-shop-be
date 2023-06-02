import { handler } from '../handlers/get-products-list';
import { availableProducts } from '../mocks/data';

describe('getProductsById', () => {
  it('returns list of available products', async () => {
    const result = await handler();

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).length).toEqual(availableProducts.length);
  });
});