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

let id = '';
// POST Todo Successful
describe('POST /api/v1/todos', () => {
  it('responds with inserting (POSTing) a Todo object into MongoDB', async () =>
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
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Single Todo Test',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Single Todo Test');
        expect(response.body).toHaveProperty('done');
      }),
  );
});

// Retrieving (GET) Single Todos
describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo of a specific ID', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Single Todo Test');
        expect(response.body).toHaveProperty('done');
      }),
  );
  it('responds with an "Invalid Id" message due to ID not being found/able to be validated by Zod (422)', async () =>
    request(app)
      .get('/api/v1/todos/notarealid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422),
  );
  it('responds with an "Not Found" error, as its a valid Mongo ObjectId not within the DB', async () =>
    request(app)
      .get('/api/v1/todos/632baf8543b57c665969e653')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404),
  );
});

// Update (PUT) Todo
describe('PUT /api/v1/todos/:id', () => {
  it('updates "content" property', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        // "done" property does not need to be sent, since it defaults to false
        content: 'Updated Content',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Updated Content');
        expect(response.body).toHaveProperty('done');
      }),
  );
  it('updates "done" property', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'Updated Content',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Updated Content');
        expect(response.body).toHaveProperty('done');
        expect(response.body.done).toBe(true);
      }),
  );
  it('responds with an "Invalid Id" message due to ID not being found/able to be validated by Zod (422)', async () =>
    request(app)
      .put('/api/v1/todos/notarealid')
      .set('Accept', 'application/json')
      .send({
        content: 'Fail',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(422),
  );
  it('responds with an "Not Found" error, as its a valid Mongo ObjectId not within the DB', async () =>
    request(app)
      .put('/api/v1/todos/632baf8543b57c665969e653')
      .set('Accept', 'application/json')
      .send({
        content: 'Fail',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(404),
  );
});

// DELETE Todo
describe('DELETE /api/v1/todos/:id', () => {
  it('responds with an "Invalid Id" message due to ID not being found/able to be validated by Zod (422)', async () => {
    request(app)
      .delete('/api/v1/todos/notarealid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
  });
  it('responds with an "Not Found" error, as its a valid Mongo ObjectId not within the DB', async () => {
    request(app)
      .delete('/api/v1/todos/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
  it('responds with a 204 status code', async () => {
    request(app)
      .delete(`/api/v1/todos/${id}`)
      .expect(204);
  });
  it('responds with an "Not Found" error when trying to GET the previous ID, as this Todo should already be deleted', async () => {
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });
});