"use strict";

const fxlisten = require("@fxlisten/core");
const { Category } = fxlisten.dynamo;

const list = async (event, context) => {
  var params = {
    FilterExpression: "attribute_not_exists(parent)"
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
};

module.exports = {
  list
};
