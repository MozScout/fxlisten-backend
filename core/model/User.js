"use strict";

let dynamoose = require("dynamoose");
let AWS = require("aws-sdk");

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `users-${process.env.ENV}`;
let User = dynamoose.model(
  table,
  {
    id: String,
    topics: String,
    subscriptions: String
  },
  { update: true }
);

exports.model = User;
