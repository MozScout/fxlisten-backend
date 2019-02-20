'use strict';

const { response, mozcast } = require('@fxlisten/core');

module.exports.handler = async (event, context) => {
  const { q } = event.queryStringParameters;
  const SEARCH = ` 
    query ($query: String!) {
	  search(query: $query) {
	  	__typename
	    ... on Podcast {
	      title
	      description
	      feedUrl
	      image
	    }
	    __typename
	    ... on Episode {
	      title
	      description
	      audioUrl
	      image
	    }
	  }
    }
  `;
  const { search } = await mozcast.graphql(SEARCH, { query: q });
  const results = search.map(result => {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      imageUrl: result.image,
      type: result.__typename.toLowerCase(),
      url: result.__typename == 'Podcast' ? result.feedUrl : result.audioUrl
    };
  });
  return response.success(results);
};
