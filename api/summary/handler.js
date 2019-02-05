"use strict";
const fxlisten = require("@fxlisten/core");
const rp = require("request-promise");

const summaryOptions = {
  uri: process.env.LISTEN_SERVER + "command/summary",
  method: "POST",
  body: "",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "x-access-token": process.env.LISTEN_JWT
  }
};

const summary = async (event, context) => {
  let jsonBody = JSON.parse(event.body);
  console.log(jsonBody.url);
  summaryOptions.form = {
    url: jsonBody.url,
    locale: "en-US",
    v: "1"
  };
  const summary = JSON.parse(await rp(summaryOptions));

  return {
    statusCode: 200,
    body: JSON.stringify(summary)
  };
};

module.exports = {
  summary
};
