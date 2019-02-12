'use strict';
const { response } = require('@fxlisten/core');
const rp = require('request-promise');

const articleOptions = {
  uri: process.env.LISTEN_SERVER + 'command/webpage',
  method: 'POST',
  body: '',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-access-token': process.env.LISTEN_JWT
  }
};

const article = async (event, context) => {
  let jsonBody = JSON.parse(event.body);
  articleOptions.form = {
    url: jsonBody.url,
    locale: 'en-US',
    v: '1'
  };
  const article = JSON.parse(await rp(articleOptions));
  return response.success(article);
};

module.exports = {
  article
};
