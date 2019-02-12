'use strict';

let jwt = require('jsonwebtoken');
const { promisify } = require('util');

const sign = async userId => {
  return promisify(jwt.sign)({ userId }, process.env.JWT_SECRET);
};

const verify = async token => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

module.exports = {
  sign,
  verify
};
