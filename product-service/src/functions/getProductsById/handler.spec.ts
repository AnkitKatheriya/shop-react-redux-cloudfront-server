import { APIGatewayProxyResult } from "aws-lambda";
import { getProductsById } from "./handler";

describe(`${getProductsById.name}`, () => {
    it('should return status code as 200 when product found', async () => {
        const mockRequest = {
            pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80a3" },
        }; 
        const result = (await getProductsById(mockRequest as any, null, null)) as APIGatewayProxyResult
        expect(result.statusCode).toEqual(200)
    })
    it('should return status code as 404 when product not found', async () => {
        const mockRequest = {
            pathParameters: { productId: "wrong_product_id" },
        }; 
        const result = (await getProductsById(mockRequest as any, null, null)) as APIGatewayProxyResult
        expect(result.statusCode).toEqual(404)
    })
})