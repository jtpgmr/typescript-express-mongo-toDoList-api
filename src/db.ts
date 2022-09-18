import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_URL}`;

export const client = new MongoClient(MONGO_URL);
export const db = client.db();

