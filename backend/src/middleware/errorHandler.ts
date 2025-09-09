import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  // Operational errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Database errors
  if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'El recurso ya existe';
  }

  if (error.message.includes('foreign key')) {
    statusCode = 400;
    message = 'Referencia inválida';
  }

  // Log error for debugging
  console.error(`Error ${statusCode}: ${message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: req.user?.userId,
  });

  const response: ApiError = {
    message,
    statusCode,
  };

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'development') {
    response.errors = [error.stack];
  }

  res.status(statusCode).json({
    success: false,
    error: response,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
