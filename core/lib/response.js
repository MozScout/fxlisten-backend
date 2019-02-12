'use strict';

const success = async body => {
  return buildResponse(200, body);
};

const failure = async body => {
  return buildResponse(500, body);
};

const unauthorized = async () => {
  return buildResponse(401, 'Unauthorized');
};

const authorized = async policy => {
  return policy;
};

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
}

module.exports = {
  success,
  failure,
  unauthorized,
  authorized
};
