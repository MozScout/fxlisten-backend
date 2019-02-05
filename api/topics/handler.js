"use strict";

const fxlisten = require("@fxlisten/core");
const { User } = fxlisten.dynamo;
const mozcast = fxlisten.mozcast;

const list = async (event, context) => {
  const { userId } = event.queryStringParameters;
  if (userId) {
    const user = await User.get(userId);
    const GET_CATEGORIES = ` 
      query($ids: [ID]) {
        categories(ids: $ids) {
          id
          name
        }
      }
    `;
    const ids = user.topics ? user.topics.split(",") : [];
    const { categories } = ids.length
      ? await mozcast.graphql(GET_CATEGORIES, { ids: ids })
      : { categories: ids };
    const topics = categories.map(category => {
      return {
        id: category.id,
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
  const { userId, topic } = JSON.parse(event.body);
  if (userId && topic) {
    let user = await User.get(userId);
    let topics = user.topics ? user.topics.split(",") : [];
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
  const { userId, topic } = JSON.parse(event.body);
  if (userId && topic) {
    let user = await User.get(userId);
    let topics = user.topics ? user.topics.split(",") : [];
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
