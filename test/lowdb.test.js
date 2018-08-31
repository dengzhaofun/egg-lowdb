'use strict';

const mock = require('egg-mock');

describe('test/lowdb.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/lowdb-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, lowdb')
      .expect(200);
  });
});
