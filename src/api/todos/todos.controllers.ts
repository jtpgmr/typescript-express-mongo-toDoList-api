import { Response, Request, NextFunction } from 'express';
import { ZodError } from 'zod';

import { TodoWithId, Todos, Todo } from './todos.model';

export const findAllTodos = async (
  req: Request, 
  res: Response<TodoWithId[]>, 
  next: NextFunction) => {
  try {
    const todos = await Todos.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (
  req: Request<{}, TodoWithId, Todo>, 
  res: Response<TodoWithId>, 
  next: NextFunction) => {
  try {
    const validateResult = await Todo.parseAsync(req.body);
    const insertResult = await Todos.insertOne(validateResult);
    // console.log(insertResult);
    // returns Mongo Obj containing acknowledgement 
    // status and _id (insertedId)
    if (!insertResult.acknowledged) {
      // throws a 500 (server-side) Error, not 400 (client-side) Error
      throw new Error('Error inserting todo.');
    }
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...validateResult,
    });
  } catch (error) {
    // ZodError is a client-side error
    // 422: Unprocessable Entity
    if (error instanceof ZodError) {
      res.status(422);
    }
    next(error);    
  }
};
