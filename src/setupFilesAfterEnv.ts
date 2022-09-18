import { client } from './db';

// disconnects from MongoDB after tests finish running
global.afterAll(async () => {
  await client.close();
});