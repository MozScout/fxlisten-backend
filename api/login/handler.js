'use strict';

const { jwt, response, dynamo } = require('@fxlisten/core');
const { User } = dynamo;

const login = async (event, context) => {
  const { userId } = JSON.parse(event.body);
  if (userId) {
    let user = await User.get(userId);
    if (user) {
      const token = await jwt.sign(userId);
      return response.success({ userId, token });
    } else {
      return response.unauthorized();
    }
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

module.exports = {
  login
};
