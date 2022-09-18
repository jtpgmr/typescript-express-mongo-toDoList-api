import request from 'supertest';

import app from '../app';

describe('GET /api/v1', () => {
  it('responds with a json message', async () => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏',
      });
  });
});

