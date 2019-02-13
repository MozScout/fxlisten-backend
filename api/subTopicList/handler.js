'use strict';

const { response, mozcast } = require('@fxlisten/core');

const list = async (event, context) => {
  const { id } = event.queryStringParameters;
  if (id) {
    const GET_SUBCATEGORIES = ` 
      query($parent: ID!) {
        subCategories(parent: $parent) {
          id
          name
        }
      }
    `;
    const { subCategories } = await mozcast.graphql(GET_SUBCATEGORIES, {
      parent: id
    });
    const topics = subCategories.map(category => {
      return {
        id: category.id,
        name: category.name,
        imageUrl: ''
      };
    });
    return response.success(topics);
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

module.exports = {
  list
};
