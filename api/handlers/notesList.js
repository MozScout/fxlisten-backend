'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const uuid = require('uuid/v1');
const { User, Note } = dynamo;

module.exports.handler = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  let notes;
  if (userId) {
    switch (event.httpMethod) {
      case 'GET':
        notes = await list(userId);
        return response.success(notes);
        break;
      case 'POST':
        await create(userId, event);
        return response.success({
          message: 'Successfully added note.'
        });
        break;
      case 'DELETE':
        await del(userId, event);
        return response.success({
          message: 'Successfully deleted note.'
        });
        break;
      default:
        return response.failure({ message: 'Invalid HTTP method.' });
    }
  } else {
    return response.failure({ message: 'Missing URL parameters' });
  }
};

const list = async userId => {
  const data = await Note.query({ userId: { eq: userId } }).exec();
  const notes = data.map(note => {
    return {
      id: note.itemId,
      title: note.title,
      imageUrl: note.imageUrl,
      timeStamp: note.timeStamp,
      userId: note.userId
    };
  });
  return notes;
};

const create = async (userId, event) => {
  let { id, timeStamp, type, imageUrl, title } = JSON.parse(event.body);
  let note = new Note({
    id: uuid(),
    itemId: id,
    userId: userId,
    timeStamp: timeStamp,
    type: type,
    imageUrl: imageUrl,
    title: title
  });
  await note.save();
  return note;
};

const del = async (userId, event) => {
  let { id } = JSON.parse(event.body);
  const note = await Note.queryOne({
    itemId: { eq: id.toString() },
    userId: { eq: userId }
  }).exec();
  const deleted = await Note.delete(note.id);
  return deleted;
};
