'use strict';

const { response, mozcast } = require('@fxlisten/core');

module.exports.handler = async (event, context) => {
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
      name: category.name,
      imageUrl: ''
    };
  });
  return response.success(topics);
};
