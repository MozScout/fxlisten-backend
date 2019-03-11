'use strict';

let dynamoose = require('dynamoose');
let AWS = require('aws-sdk');

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `events-${process.env.ENV}`;
let Event = dynamoose.model(
  table,
  {
    id: String,
    createdAt: String,
    eventType: {
      type: String,
      index: {
        global: true,
        name: 'eventTypeIndex'
      }
    },
    itemId: {
      type: String,
      index: {
        global: true,
        name: 'itemIdIndex'
      }
    },
    itemType: {
      type: String,
      index: {
        global: true,
        name: 'itemTypeIndex'
      }
    },
    userId: {
      type: String,
      index: {
        global: true,
        name: 'userIndex'
      }
    },
    data: String
  },
  { update: true }
);

exports.model = Event;
