'use strict';
const { response } = require('@fxlisten/core');
const rp = require('request-promise');

const summaryOptions = {
  uri: process.env.LISTEN_SERVER + 'command/summary',
  method: 'POST',
  body: '',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-access-token': process.env.LISTEN_JWT
  }
};

module.exports.handler = async (event, context) => {
  let jsonBody = JSON.parse(event.body);
  summaryOptions.form = {
    url: jsonBody.url,
    locale: 'en-US',
    v: '1'
  };
  const summary = JSON.parse(await rp(summaryOptions));
  return response.success(summary);
};
