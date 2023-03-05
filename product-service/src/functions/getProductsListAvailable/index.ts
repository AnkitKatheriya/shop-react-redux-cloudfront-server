import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        http: {
          method: "get",
          path: "/products/available",
          responseData: {
            200: {
              description: "Products List",
              bodyType: "Products",
            },
          },
        },
      },
    ],
  };