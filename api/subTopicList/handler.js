"use strict";

const fxlisten = require("@fxlisten/core");
const mozcast = fxlisten.mozcast;

const list = async (event, context) => {
  const { topic } = event.queryStringParameters;
  if (topic) {
    const GET_SUBCATEGORIES = ` 
      query($parent: ID!) {
        subCategories(parent: $parent) {
          id
          name
        }
      }
    `;
    const { subCategories } = await mozcast.graphql(GET_SUBCATEGORIES, {
      parent: topic
    });
    const topics = subCategories.map(category => {
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

module.exports = {
  list
};
