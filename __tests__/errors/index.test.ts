import {
  BadRequestError,
  CustomError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../src/errors';

describe('Custom Errors', () => {
  it('CustomError should set correct properties', () => {
    const error = new CustomError(503, 'Service Unavailable', {
      reason: 'overload',
    });
    expect(error.statusCode).toBe(503);
    expect(error.message).toBe('Service Unavailable');
    expect(error.details).toEqual({ reason: 'overload' });
    expect(error.name).toBe('CustomError');
    expect(error.stack).toBeDefined(); // Check if stack trace is captured
  });

  it('BadRequestError should have correct status code and default message', () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
  });

  it('BadRequestError should accept custom message and details', () => {
    const error = new BadRequestError('Invalid input', { field: 'username' });
    expect(error.message).toBe('Invalid input');
    expect(error.details).toEqual({ field: 'username' });
  });

  it('UnauthorizedError should accept custom message and details', () => {
    const error = new UnauthorizedError('Invalid credentials', {
      reason: 'expired token',
    });
    expect(error.message).toBe('Invalid credentials');
    expect(error.details).toEqual({ reason: 'expired token' });
  });

  it('ForbiddenError should accept custom message and details', () => {
    const error = new ForbiddenError('Access denied', { resource: '/admin' });
    expect(error.message).toBe('Access denied');
    expect(error.details).toEqual({ resource: '/admin' });
  });

  it('NotFoundError should accept custom message and details', () => {
    const error = new NotFoundError('User not found', { id: 123 });
    expect(error.message).toBe('User not found');
    expect(error.details).toEqual({ id: 123 });
  });

  it('ValidationError should accept custom message and details', () => {
    const error = new ValidationError('Invalid email format', {
      field: 'email',
    });
    expect(error.message).toBe('Invalid email format');
    expect(error.details).toEqual({ field: 'email' });
  });

  it('InternalServerError should accept custom message and details', () => {
    const error = new InternalServerError('Database error', {
      code: 'ER_DUP_ENTRY',
    });
    expect(error.message).toBe('Database error');
    expect(error.details).toEqual({ code: 'ER_DUP_ENTRY' });
  });
  it('UnauthorizedError should have correct status code and default message', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });

  it('ForbiddenError should have correct status code and default message', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden');
  });

  it('NotFoundError should have correct status code and default message', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
  });

  it('ValidationError should have correct status code and default message', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(422);
    expect(error.message).toBe('Validation Error');
  });

  it('InternalServerError should have correct status code and default message', () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal Server Error');
  });

  it('should correctly set the name property for each error class', () => {
    expect(new BadRequestError().name).toBe('BadRequestError');
    expect(new UnauthorizedError().name).toBe('UnauthorizedError');
    expect(new ForbiddenError().name).toBe('ForbiddenError');
    expect(new NotFoundError().name).toBe('NotFoundError');
    expect(new ValidationError().name).toBe('ValidationError');
    expect(new InternalServerError().name).toBe('InternalServerError');
  });
});
