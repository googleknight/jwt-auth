/**
 * Custom error classes for HTTP status codes and error handling.
 * Extends the base Error class to include status codes and optional details.
 * Each error class corresponds to a specific HTTP status code and provides
 * default error messages that can be overridden.
 *
 * @class CustomError - Base class for all custom errors
 * @class BadRequestError - 400 Bad Request errors
 * @class UnauthorizedError - 401 Unauthorized errors
 * @class ForbiddenError - 403 Forbidden errors
 * @class NotFoundError - 404 Not Found errors
 * @class ValidationError - 422 Validation errors
 * @class InternalServerError - 500 Internal Server errors
 */

export class CustomError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(404, message, details);
  }
}

export class ValidationError extends CustomError {
  constructor(message = 'Validation Error', details?: unknown) {
    super(422, message, details);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(500, message, details);
  }
}
