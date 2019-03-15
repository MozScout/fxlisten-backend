'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const { User } = dynamo;

module.exports.handler = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  let items;
  if (userId) {
    switch (event.httpMethod) {
      case 'GET':
        items = await list(userId, event);
        return response.success(items);
        break;
      case 'PUT':
        await update(userId, event);
        return response.success({
          message: 'Successfully added subscription.'
        });
        break;
      case 'DELETE':
        await del(userId, event);
        return response.success({
          message: 'Successfully removed subscription.'
        });

        break;
      default:
        return response.failure({ message: 'Invalid HTTP method.' });
    }
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

// response format for this method is not finished
// need to incorporate articles and combine results
const list = async (userId, event) => {
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
};

const update = async (userId, event) => {
  let user = await User.get(userId);
  let subscriptions = user[type] ? user[type].split(',') : [];
  if (!subscriptions.includes(id)) subscriptions.push(id);
  user[type] = subscriptions.join(',');
  await user.save();
  return user;
};

const del = async (userId, event) => {
  let user = await User.get(userId);
  let subscriptions = user[type] ? user[type].split(',') : [];
  subscriptions = subscriptions.filter(itemId => itemId !== id);
  user[type] = subscriptions.join(',');
  await user.save();
  return user;
};
