import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ValidationError';

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const apiError = err as ApiError;
  let statusCode = apiError.statusCode || 500;
  let code = apiError.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // If it's a ValidationError instance, treat as 400
  if (err.name === 'ValidationError' || apiError.code === 'VALIDATION_ERROR') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  }
  // If it's a validation error (from value objects or validation), treat as 400
  else if (message.includes('Invalid') || message.includes('Missing') || message.includes('format') || message.includes('required')) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  }

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${code}] ${message}`, err);
  }

  const response: ErrorResponse = {
    error: {
      code,
      message,
      statusCode,
    },
  };

  res.status(statusCode).json(response);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
