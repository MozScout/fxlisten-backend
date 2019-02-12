'use strict';

const { response, mozcast } = require('@fxlisten/core');

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
      image_url: ''
    };
  });
  return response.success(topics);
};

module.exports = {
  list
};
