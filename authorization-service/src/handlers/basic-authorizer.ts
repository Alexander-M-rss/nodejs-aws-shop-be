import { APIGatewayTokenAuthorizerEvent, Callback, Context } from 'aws-lambda';

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ctx: Context,
  cb: Callback,
) => {
  const { authorizationToken } = event;

  if (!authorizationToken) {
    cb('Unauthorized');
  }

  try {
    const [authType, encodedCredentials] = authorizationToken.split(' ');

    if (authType !== 'Basic' || !encodedCredentials) {
      cb('Unauthorized');
    }

    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64',
    ).toString('utf-8');

    const [username, password] = decodedCredentials.split(':');
    const storedPassword = process.env[username.toLowerCase()];
    const effect =
      storedPassword && storedPassword === password ? 'Allow' : 'Deny';
    const policy = generatePolicy(decodedCredentials, effect, event.methodArn);

    cb(null, policy);
  } catch (error) {
    const errorMsg =
      (error instanceof Error && error.message) || 'Unknown error';

    cb(`Unauthorized: ${errorMsg}`);
  }
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
) => {
  const policy = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {},
  };

  return policy;
};
