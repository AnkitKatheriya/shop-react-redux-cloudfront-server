import { SQSEvent } from "aws-lambda";
import { catalogBatchProcess } from "./handler";
import records from "./mockRequest.json";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import {
    DynamoDBDocumentClient,
    BatchWriteCommand,
    BatchWriteCommandOutput,
  } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "../../constants";

const event: SQSEvent = records as SQSEvent
let ddbdocumentclient = mockClient(DynamoDBDocumentClient)
let mockSnsClient = mockClient(SNSClient)
const batchWriteCommandOutput : BatchWriteCommandOutput = {
    UnprocessedItems: {
        [TABLE_NAME]: [
            {
                PutRequest: {
                    Item: { id: "failed" },
                },
            },
        ],
    },
    $metadata: {
        httpStatusCode: 200,
        requestId: "H4TI0FSS4DDC7UGTVO4LH0U0MBVV4KQNSO5AEMVJF66Q9ASUAAJG",
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
    },
}

describe("catalogBatchProcess",() => {
    beforeEach(() => {
        ddbdocumentclient.reset()
        mockSnsClient.reset()
        ddbdocumentclient.on(BatchWriteCommand).resolves(batchWriteCommandOutput);
    })
    it("should import products", async () => {
        const result = await catalogBatchProcess(event);
        expect(ddbdocumentclient).toReceiveCommandTimes(BatchWriteCommand, 1);
        expect(mockSnsClient).toReceiveCommandTimes(PublishCommand, 1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe("failed");
    })
})