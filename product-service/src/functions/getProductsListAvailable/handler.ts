import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

// import { products } from './data';
import schema from './schema';
import { getAllAvailableProducts } from 'src/repository/products';


export const getProductsListAvailable: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`Invoke: getProductsListAvailable`)
  const count = Number(event?.queryStringParameters?.count || 1);
  try {
    return formatJSONResponse({
      message: 'list of products',
      data: await getAllAvailableProducts(count),
    });
  } catch(error) {
    console.log(`Error: getProductsListAvailable error message ${error.message}`)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
};

export const main = middyfy(getProductsListAvailable);
