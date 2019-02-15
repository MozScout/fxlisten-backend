'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const { User } = dynamo;

// response format for this method is not finished
// need to incorporate articles and combine results
const list = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  if (userId) {
    const podcasts = await getPodcasts(userId);
    return response.success(podcasts);
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const update = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  const { id, type } = JSON.parse(event.body);
  if (userId && id) {
    let user = await User.get(userId);
    let subscriptions = user[type] ? user[type].split(',') : [];
    if (!subscriptions.includes(id)) subscriptions.push(id);
    user[type] = subscriptions.join(',');
    await user.save();
    return response.success({
      message: 'Successfully added subscription.'
    });
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const del = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  const { id, type } = JSON.parse(event.body);
  if (userId && id) {
    let user = await User.get(userId);
    let subscriptions = user[type] ? user[type].split(',') : [];
    subscriptions = subscriptions.filter(itemId => itemId !== id);
    user[type] = subscriptions.join(',');
    await user.save();
    return response.success({
      message: 'Successfully removed subscription.'
    });
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

module.exports = {
  list,
  update,
  del
};

async function getPodcasts(userId) {
  const user = await User.get(userId);
  const GET_PODCASTS = `
    query($ids: [ID]) {
      podcasts(ids: $ids) {
        id
        title
        description
        feedUrl
        image
        episodes {
          id
          title
          audioUrl
          description
          image
          dur
        }
      }
    }
  `;
  const ids = user.podcasts ? user.podcasts.split(',') : [];
  const { podcasts } = ids.length
    ? await mozcast.graphql(GET_PODCASTS, { ids: ids })
    : { podcasts: ids };
  return podcasts;
}

async function getArticles(userId) {
  // implement scout integration
}
