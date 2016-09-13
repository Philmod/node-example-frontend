var app = require('../index');
var expect = require('chai').expect;
var request = require('supertest');

describe('status.routes.test.js', () => {

  describe('GET /status', () => {

    it('responds with status information', (done) => {
      request(app)
        .get('/status')
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          expect(res.body.server.status).to.equal('up');
          done();
        });
    });

  });

});
