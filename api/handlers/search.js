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
  	const item = {
      id: result.id,
      title: result.title,
      description: result.description,
      imageUrl: result.image,
      type: result.__typename.toLowerCase()
    };	
    if (result.__typename == 'Podcast') {
    	item.feedUrl = result.feedUrl;
    }
    if (result.__typename == 'Episode') {
    	item.audioUrl = result.audioUrl;
    }
    return item;
  });
  return response.success(results);
};
