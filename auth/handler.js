'use strict';

const { jwt, response, dynamo } = require('@fxlisten/core');
const { User } = dynamo;

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.authorize = async (event, context) => {
  if (typeof event.authorizationToken === 'undefined') {
    return response.unauthorized();
  }

  const split = event.authorizationToken.split('Bearer');
  if (split.length !== 2) {
    return response.unauthorized();
  }

  const token = split[1].trim();
  const decoded = await jwt.verify(token);
  const user = await User.get(decoded.userId);

  if (user) {
    return response.authorized(
      generatePolicy(user.id, 'Allow', event.methodArn)
    );
  } else {
    return response.unauthorized();
  }
};
