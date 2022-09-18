import * as z from 'zod';
import { WithId } from 'mongodb';

import { db } from '../../db';

// there are 2 modules in this file named 'Todo'
// 1) the schema with object validator
// 2) the type of Todo

export const Todo = z.object({
  content: z.string().min(1),
  done: z.boolean().default(false),
});

export type Todo = z.infer<typeof Todo>;

// to accept a Todo response with an additional id prop (from Mongo)
export type TodoWithId = WithId<Todo>;

export const Todos = db.collection<Todo>('todos');