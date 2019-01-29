"use strict";

const path = require("path");
const glob = require("glob");
const rootDir = require("app-root-dir").get();

let db = {};

glob
  .sync(rootDir + "/node_modules/@fxlisten/core/model/*.js", { follow: true })
  .forEach(file => {
    const modelName = path.basename(file, ".js");
    const { model } = require(file);
    db[modelName] = model;
  });

module.exports = db;
