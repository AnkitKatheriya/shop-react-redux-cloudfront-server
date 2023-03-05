import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import middyJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";
import { v4 as uuidv4 } from "uuid";

import schema from "./schema";
import { putProduct } from "../../repository/products";


export const createProduct = async (event) => {
  console.log(`Invoke: createProduct with body ${event.body}`)
  const newId = uuidv4();
  const item = {
    ...event.body,
    id: newId,
  };
  try {
    await putProduct(item);
    return formatJSONResponse({
      message: 'New item added',
      data: item,
    });
  } catch(error) {
    console.log(`Error: createProduct error message ${error.message}`)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
};

const requestSchema = transpileSchema(schema, {
  verbose: true,
});

export const main = middyfy(createProduct)
  .use(middyJsonBodyParser())
  .use(validator({ eventSchema: requestSchema }))
  .use(httpErrorHandler());
