"use strict";

const fxlisten = require("@fxlisten/core");
const { Category } = fxlisten.dynamo;

const list = async (event, context) => {
  const { topic } = event.queryStringParameters;
  if (topic) {
    var params = {
      FilterExpression: "parent = :parent",
      ExpressionAttributeValues: {
        ":parent": topic
      }
    };
    const categories = await Category.scan(params).exec();
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

module.exports = {
  list
};
