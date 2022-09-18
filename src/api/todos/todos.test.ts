import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';

// will FAIL if Mongo configured incorrectly
beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {}
});

// Retrieving (GET) All Todos
describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});

// POST 'empty Todo' error
describe('POST /api/v1/todos', () => {
  it('responds with Error because Todo is invalid ("content" prop empty)', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({ content: '' })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        // console.log(response.body);
        expect(response.body).toHaveProperty('message');
      }),
  );
});

// POST Todo Successful
describe('POST /api/v1/todos', () => {
  it('responds with inserted Todo object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({ 
        content: 'Passing Test',
        done: false, 
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        // a successful insert should also have an additional _id property applied to it
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Passing Test');
        expect(response.body).toHaveProperty('done');
      }),
  );
});