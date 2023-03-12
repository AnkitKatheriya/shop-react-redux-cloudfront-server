import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

// import { products } from './data';
import schema from './schema';
import { getAllProducts } from 'src/repository/products';


export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log(`Invoke: getProductsList`)
  try {
    return formatJSONResponse({
      message: 'list of products',
      data: await getAllProducts(),
    });
  } catch(error) {
    console.log(`Error: getProductsList error message ${error.message}`)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
};

export const main = middyfy(getProductsList);
