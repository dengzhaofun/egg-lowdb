'use strict';
const lowdb = require('./lib/lowdb');

module.exports = app => {
  if (app.config.lowdb.app) lowdb(app);
};
