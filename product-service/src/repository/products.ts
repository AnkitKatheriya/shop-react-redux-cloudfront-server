import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    BatchWriteCommand,
    BatchWriteCommandInput,
    DynamoDBDocumentClient,
    // GetCommand,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { REGION, TABLE_NAME } from "../constants"
import { IProduct, Products } from "./product";
import { products } from './mockData'

const dbClient = new DynamoDBClient({
    region: REGION
})
const documentClient = DynamoDBDocumentClient.from(dbClient)

export async function getAllProducts(): Promise<Products> {
    const result = await documentClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );
    return result.Items as Products;
}

export async function getAllAvailableProducts(
    notLessCount: number
  ): Promise<Products> {
    const result = await documentClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        IndexName: "AvailableProducts",
        FilterExpression: "#productCount >= :amount",
        ExpressionAttributeValues: {
          ":amount": notLessCount,
        },
        ExpressionAttributeNames: {
          "#productCount": "count",
        },
      })
    );
    return result.Items as Products;
  }

  export async function queryProductById(productId: string): Promise<IProduct> {
    // const result = await documentClient.send(
    //   new GetCommand({ TableName: TABLE_NAME, Key: { id: productId } })
    // );
    // console.log("queryProductById result and productID", result, productId)
    // return result.Item as IProduct;
    return products.find((item) => item.id === productId);
  }
  
  export async function putProduct(product: IProduct) {
    await documentClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...product,
        },
      })
    );
  }

  export async function batchPutProduct(products: IProduct[]) : Promise<string[]> {
    const putRequests = products.map((product) => {
      return {
        PutRequest: {
          Item: product
        }
      }
    })

    const batch: BatchWriteCommandInput = {
      RequestItems: {
        [TABLE_NAME]: putRequests
      }
    }

    const result = await documentClient.send(new BatchWriteCommand(batch))
    const failedIds: string[] = result.UnprocessedItems[TABLE_NAME]?.map((request) => {
      return request?.PutRequest?.Item?.id
    }) || []

    return failedIds
  }