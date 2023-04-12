import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/getProductsList'
import getProductsById from '@functions/getProductsById';
import getProductsListAvailable from '@functions/getProductsListAvailable';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess'

import { REGION } from "./src/constants";
import { ProductsTable } from "./serverless_resources/dynamodb";
import { ImportQueue } from "./serverless_resources/sqs";
import { Notifications } from "./serverless_resources/notifications";

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: [
          { "Fn::GetAtt": ["ProductsTable", "Arn"] },
          {
            "Fn::Join": [
              "",
              [{ "Fn::GetAtt": ["ProductsTable", "Arn"] }, "/index/*"],
            ],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: ["sns:Publish"],
        Resource: [{ "Fn::GetAtt": ["Notifications", "TopicArn"] }],
      },
    ],
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    getProductsListAvailable,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: "products service",
      apiType: "http",
    },
  },
  resources: {
    Resources: {
      ...ProductsTable,
      ...ImportQueue,
      ...Notifications,
    },
  },
};

module.exports = serverlessConfiguration;
