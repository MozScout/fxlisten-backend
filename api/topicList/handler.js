"use strict";

const fxlisten = require("@fxlisten/core");
const mozcast = fxlisten.mozcast;

const list = async (event, context) => {
  const GET_CATEGORIES = ` 
    query {
      categories {
        id
        name
      }
    }
  `;
  const { categories } = await mozcast.graphql(GET_CATEGORIES);
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
};

module.exports = {
  list
};
