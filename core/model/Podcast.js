"use strict";

let dynamoose = require("dynamoose");
let AWS = require("aws-sdk");

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `podcasts-${process.env.ENV}`;
let Podcast = dynamoose.model(table, {
  id: String,
  title: String,
  description: String,
  link: String,
  feedUrl: String,
  image: String,
  language: String,
  copyright: String,
  updatedAt: String,
  explicit: Boolean,
  authorName: String,
  ownerName: String,
  ownerEmail: String
});

exports.model = Podcast;
