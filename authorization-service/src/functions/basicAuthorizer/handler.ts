//import { APIGatewayRequestAuthorizerEvent, PolicyDocument, APIGatewayAuthorizerResult } from 'aws-lambda';
import { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerResult } from 'aws-lambda';
import { UNAUTHORIZED } from 'src/constants';

// enum Effect {
//   Allow = 'Allow',
//   Deny = 'Deny'
// }


// const generatePolicyDocument = (effect: Effect, resource: string): PolicyDocument => {
//   return {
//     Version: '2012-10-17',
//     Statement: [{
//       Action: 'execute-api:Invoke',
//       Effect: effect,
//       Resource: resource
//     }]
//   }
// }

// const generateResponse = (principalId: string, effect: Effect, resource: string): APIGatewayAuthorizerResult => {
//   return {
//     principalId,
//     policyDocument: generatePolicyDocument(effect, resource)
//   }
// }

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEventV2) : Promise<APIGatewaySimpleAuthorizerResult> => {
  console.log('Authorizer event', event)
  
  //const { headers, methodArn } = event
  const { headers } = event 

  if(!headers?.Authorization) {
    throw new Error(UNAUTHORIZED)
  }

  const authToken = headers?.Authorization?.split(" ")[1]

  const decodedString = Buffer.from(authToken, 'base64').toString()

  const [username, password] = decodedString.split(":");

  const expectedPassword = process.env[username];
  
  // const response = expectedPassword === password
  //   ? generateResponse(username, Effect.Allow, methodArn)
  //   : generateResponse(username, Effect.Deny, methodArn)

  const response = {
    isAuthorized: expectedPassword === password
  }
  console.log("Authentication Response", JSON.stringify(response))

  return response
};

export const main = basicAuthorizer;
