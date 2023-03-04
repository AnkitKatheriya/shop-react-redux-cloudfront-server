import { APIGatewayProxyResult } from "aws-lambda";
import { getProductsList } from "./handler"

describe(`${getProductsList.name}`, () => {
    it('should return list of products', async () => {
        const mockEvent= {}
        const result = (await getProductsList(mockEvent as any, null, null)) as APIGatewayProxyResult
        expect(result.statusCode).toEqual(200)
        expect(JSON.parse(result.body).data.length).toBeGreaterThan(0)
    })
})