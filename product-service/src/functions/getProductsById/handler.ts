import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from './data';

import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const foundProduct = products.filter((product) => {
    return product.id === event.pathParameters.productId
  })[0]
  if(foundProduct){
    return formatJSONResponse({
      message: `Product detail page!`,
      data: foundProduct,
    });
  }else {
    return {
      statusCode: 404,
      body: 'Product not found',
    }
  }
  
};

export const main = middyfy(getProductsById);
