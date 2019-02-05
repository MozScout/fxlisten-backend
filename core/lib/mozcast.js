"use strict";

const { request } = require("graphql-request");

const graphql = async (query, variables) => {
  const MOZCAST_API =
    "https://8mrij8jvj2.execute-api.us-east-1.amazonaws.com/dev-test/graphql";
  return await request(MOZCAST_API, query, variables);
};

module.exports = {
  graphql
};
