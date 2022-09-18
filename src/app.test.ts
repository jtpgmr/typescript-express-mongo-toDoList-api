import request from 'supertest';

import app from './app';

describe('app', () => {
  it('responds with not found message', async () => {
    request(app)
      .get('/imaginary-endpoint')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('GET /', () => {
  it('responds with a json message', async () => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Hi from the / route 👋',
      });
  });
});
