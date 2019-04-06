
'use strict';

const assert = require('assert');
const low = require('lowdb');
const axios = require('axios');
const FileAsync = require('lowdb/adapters/FileAsync');
const Base = require('lowdb/adapters/Base');
let count = 0;

class HTTPStorage extends Base {
  async read() {
    const response = await axios.get(this.source);
    return response.data;
  }
}

class ACMStorage extends Base {
  constructor(source, options) {
    super(source, options);
    this.acm = options.acm;
  }
  async read() {
    const data = await this.acm.getConfig(this.source.dataId, this.source.group);
    return JSON.parse(data);
  }
}

module.exports = app => {
  app.addSingleton('lowdb', async (config, app) => {
    assert(config.path && config.adapter, `[egg-lowdb] 'path: ${config.path}', 'adapter: ${config.adapter}' are required on config`);
    let db;
    if (config.adapter === 'file') {
      db = await low(new FileAsync(config.path));
    } else if (config.adapter === 'remote') {
      db = await low(new HTTPStorage(config.path));
    } else if (config.adapter === 'acm') {
      db = await low(new ACMStorage(config.path, {acm: app.acm}));

      app.acm.subscribe(config.path, (data) => {
        db.setState(JSON.parse(data));
      });
    }

    app.beforeStart(() => {
      const index = count++;
      app.coreLogger.info(`[egg-lowdb] instance[${index}] status OK`);
    });
    return db;
  });
};
