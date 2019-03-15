'use strict';

const { response, dynamo } = require('@fxlisten/core');
const _ = require('lodash');
const uuid = require('uuid/v1');
const { Event } = dynamo;

module.exports.handler = async (event, context) => {
  const userId = event.requestContext.authorizer.principalId;
  let { eventType, itemId, itemType, data } = JSON.parse(event.body);
  let newEvent = new Event({
    id: uuid(),
    userId: userId,
    createdAt: new Date(),
    eventType: eventType,
    itemId: itemId,
    itemType: itemType,
    data: JSON.stringify(data)
  });
  await newEvent.save();
  return response.success({
    message: 'Successfully logged event.'
  });
};
