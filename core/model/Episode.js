"use strict";

let dynamoose = require("dynamoose");
let AWS = require("aws-sdk");

let dynamoDB = new AWS.DynamoDB();
dynamoose.setDDB(dynamoDB);

const table = `episodes-${process.env.ENV}`;
let Episode = dynamoose.model(table, {
  id: String,
  podcastId: String,
  guid: String,
  title: String,
  description: String,
  explicit: Boolean,
  image: String,
  published: String,
  duration: String,
  filesize: String,
  filetype: String,
  audioUrl: String,
  internalUrl: String,
  transcriptUrl: String,
  transcript: String
});

exports.model = Episode;
