import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "/products",
        responseData: {
          200: {
            description: "Newly added product",
            bodyType: "Product",
          },
        },
        bodyType: "CreateProductRequest",
      },
    },
  ],
};