import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { IdParams } from '../../interfaces/IdParams';

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

export const findOneTodo = async (req: Request<IdParams, TodoWithId, {}>, res: Response<TodoWithId>, next: NextFunction) => {
  try {
    const foundTodo = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(foundTodo);
    if (!foundTodo) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.json(foundTodo);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (
  req: Request<{}, TodoWithId, Todo>, 
  res: Response<TodoWithId>, 
  next: NextFunction) => {
  try {
    const insertResult = await Todos.insertOne(req.body);
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
      ...req.body,
    });
  } catch (error) {
    next(error);    
  }
};

export const updateTodo = async (req: Request<IdParams, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) => {
  try {
    const updateResult = await Todos.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      // returns Todo after find and set are complete (once its been updated)
      returnDocument: 'after',
    });

    if (!updateResult.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }

    res.json(updateResult.value);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req: Request<IdParams, {}, {}>, res: Response<{}>, next: NextFunction) => {
  try {
    // similiar to findOneAndUpdate, but nothing is being $set in the req.body
    const deleteResult = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    // if no value exists, it means that a Todo was not found
    if (!deleteResult.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};