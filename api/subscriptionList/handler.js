'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const { User } = dynamo;

const list = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  if (userId) {
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
    const ids = user.subscriptions ? user.subscriptions.split(',') : [];
    const { podcasts } = ids.length
      ? await mozcast.graphql(GET_PODCASTS, { ids: ids })
      : { podcasts: ids };
    return response.success(podcasts);
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const update = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  const { subscription } = JSON.parse(event.body);
  if (userId && subscription) {
    let user = await User.get(userId);
    let subscriptions = user.subscriptions ? user.subscriptions.split(',') : [];
    if (!subscriptions.includes(subscription)) subscriptions.push(subscription);
    user.subscriptions = subscriptions.join(',');
    await user.save();
    return response.success({
      message: 'Subscription successfully added to list.'
    });
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const del = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  const { subscription } = JSON.parse(event.body);
  if (userId && subscription) {
    let user = await User.get(userId);
    let subscriptions = user.subscriptions ? user.subscriptions.split(',') : [];
    subscriptions = subscriptions.filter(id => id !== subscription);
    user.subscriptions = subscriptions.join(',');
    await user.save();
    return response.success({
      message: 'Subscription successfully removed from list.'
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
