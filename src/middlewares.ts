import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

import ErrorResponse from './interfaces/ErrorResponse';

dotenv.config();

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // err.stack not shown during production for security reasons
    // it's important not to leak file/folder info (ie names) from the error stack
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
