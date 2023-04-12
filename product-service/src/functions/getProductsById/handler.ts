import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { queryProductById } from '../../repository/products';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event.pathParameters.productId;
  console.log(`Invoke: getProductsById with ${productId}`)
  try {
    const result = await queryProductById(productId);
    if(result){
      return formatJSONResponse({
        message: `Product detail page!`,
        data: result,
      });
    }else {
      return {
        statusCode: 404,
        body: 'Product not found',
      }
    }
  } catch(error) {
    console.log(`Error: getProductsById error message ${error.message}`)
    return {
      statusCode: 500,
      body: "Internal server error",
    }
  }
  
};

export const main = middyfy(getProductsById);
