'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const { User } = dynamo;

module.exports.handler = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  let topics;
  if (userId) {
    switch (event.httpMethod) {
      case 'GET':
        topics = await list(userId, event);
        return response.success(topics);
        break;
      case 'POST':
        await update(userId, event);
        return response.success({
          message: 'Successfully subscribed to topic.'
        });
        break;
      case 'DELETE':
        await del(userId, event);
        return response.success({
          message: 'Successfully unsubscribed from topic.'
        });
        break;
      default:
        return response.failure({ message: 'Invalid HTTP method.' });
    }
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const list = async (userId, event) => {
  const user = await User.get(userId);
  const GET_CATEGORIES = ` 
    query($ids: [ID]) {
      categories(ids: $ids) {
        id
        name
      }
    }
  `;
  const ids = user.topics ? user.topics.split(',') : [];
  const { categories } = ids.length
    ? await mozcast.graphql(GET_CATEGORIES, { ids: ids })
    : { categories: ids };
  const topics = categories.map(category => {
    return {
      id: category.id,
      name: category.name,
      imageUrl: ''
    };
  });
  return topics;
};

const update = async (userId, event) => {
  let user = await User.get(userId);
  let topics = user.topics ? user.topics.split(',') : [];
  if (!topics.includes(id)) topics.push(id);
  user.topics = topics.join(',');
  await user.save();
  return user;
};

const del = async (userId, event) => {
  let user = await User.get(userId);
  let topics = user.topics ? user.topics.split(',') : [];
  topics = topics.filter(topicId => topicId !== id);
  user.topics = topics.join(',');
  await user.save();
  return user;
};
