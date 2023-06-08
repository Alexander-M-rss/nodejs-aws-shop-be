import pgClient from './index';

export const getProductsList = () =>
  pgClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .select('products.*', 'stocks.count');

export const getProductsById = (productId: string) =>
  pgClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .select('products.*', 'stocks.count')
    .where('products.id', productId)
    .first();
