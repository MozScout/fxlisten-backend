"use strict";

const uuid = require("uuid/v1");
const fxlisten = require("@fxlisten/core");
const { User } = fxlisten.dynamo;

const create = async (event, context) => {
  const { topics } = event.queryStringParameters;
  if (topics && Array.isArray(topics.split(","))) {
    const userId = uuid();
    let user = new User({
      id: userId,
      topics: topics
    });
    await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: userId
      })
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Missing URL parameters"
      })
    };
  }
};

module.exports = {
  create
};
