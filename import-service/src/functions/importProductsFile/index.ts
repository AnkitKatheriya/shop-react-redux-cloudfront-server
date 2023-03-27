import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/import",
        cors: true,
        authorizer: {
          arn: "arn:aws:lambda:ap-south-1:774443438087:function:authorization-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0
        },
      },
    },
  ],
};
