'use strict';

let dynamoose = require('dynamoose');
let AWS = require('aws-sdk');

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `notes-${process.env.ENV}`;
let Note = dynamoose.model(
  table,
  {
    id: String,
    itemId: {
      type: String,
      index: {
        global: true,
        name: 'itemIndex'
      }
    },
    userId: {
      type: String,
      index: {
        global: true,
        name: 'userIndex'
      }
    },
    title: String,
    imageUrl: String,
    timeStamp: Number
  },
  { update: true }
);

exports.model = Note;
