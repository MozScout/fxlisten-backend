'use strict';

const uuid = require('uuid/v1');
const { jwt, response, dynamo } = require('@fxlisten/core');
const { User } = dynamo;

module.exports.handler = async (event, context) => {
  const { topics } = JSON.parse(event.body);
  if (topics && topics.length) {
    const userId = uuid();
    let user = new User({
      id: userId,
      topics: topics.join(',')
    });
    await user.save();
    const token = await jwt.sign(userId);
    return response.success({ userId, token });
  } else {
    return response.success({
      message: 'Missing URL parameters'
    });
  }
};
