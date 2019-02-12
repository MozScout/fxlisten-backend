'use strict';

const { response, mozcast } = require('@fxlisten/core');

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
        image_url: ''
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
