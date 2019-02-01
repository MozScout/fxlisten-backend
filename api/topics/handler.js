"use strict";

const fxlisten = require("@fxlisten/core");
const { Category, User } = fxlisten.dynamo;

const list = async (event, context) => {
  const { userId } = event.queryStringParameters;
  if (userId) {
    const user = await User.get(userId);
    const params = user.topics.split(",").map(id => {
      return { id: id };
    });
    const categories = await Category.batchGet(params);
    const topics = categories.map(category => {
      return {
        topic: category.name,
        image_url: ""
      };
    });
    return {
      statusCode: 200,
      body: JSON.stringify(topics)
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

const update = async (event, context) => {
  const { userId, topic } = event.queryStringParameters;
  if (userId && topic) {
    let user = await User.get(userId);
    let topics = user.topics.split(",");
    if (!topics.includes(topic)) topics.push(topic);
    user.topics = topics.join(",");
    await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Topic successfully added to list."
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

const del = async (event, context) => {
  const { userId, topic } = event.queryStringParameters;
  if (userId && topic) {
    let user = await User.get(userId);
    let topics = user.topics.split(",");
    topics = topics.filter(id => id !== topic);
    user.topics = topics.join(",");
    await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Topic successfully removed from list."
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
  list,
  update,
  del
};
