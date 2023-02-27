import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from './data';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    message: `Product detail page!`,
    data: products.filter((product) => {
      return product.id === event.pathParameters.productId
    })[0],
  });
};

export const main = middyfy(getProductsById);
