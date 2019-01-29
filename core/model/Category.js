"use strict";

let dynamoose = require("dynamoose");
let AWS = require("aws-sdk");

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `categories-${process.env.ENV}`;
let Category = dynamoose.model(table, {
  id: String,
  name: String
});

exports.model = Category;
