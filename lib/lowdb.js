
'use strict';

const assert = require('assert');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
let count = 0;
module.exports = app => {
  app.addSingleton('lowdb', (config, app) => {
    assert(config.path, `[egg-lowdb] 'path: ${config.path}' are required on config`);
    const db = low(new FileSync(config.path));

    app.beforeStart(() => {
      const index = count++;
      app.coreLogger.info(`[egg-lowdb] instance[${index}] status OK`);
    });
    return db;
  });
};
