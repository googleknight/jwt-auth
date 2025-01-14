import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';
import { createErrorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response | void => {
  logger.error('Error:', err);

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(err.statusCode, err.message, err.details));
  }

  // Handle unexpected errors
  const internalError = createErrorResponse(
    500,
    'Internal Server Error',
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );

  return res.status(500).json(internalError);
};
