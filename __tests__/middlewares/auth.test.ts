import { Request, Response, NextFunction } from 'express';
import { checkJWT } from '../../src/services';
import { CustomRequest, Roles } from '../../src/types';
import { ForbiddenError, NotFoundError } from '../../src/errors';
import { authenticate, authorize } from '../../src/middlewares';

jest.mock('../../src/services');
jest.mock('../../src/errors');

describe('Middleware: authenticate', () => {
  const req = { headers: { authorization: 'testToken' } } as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  it('should attach JWT payload to request object when token is valid', () => {
    (checkJWT as jest.Mock).mockReturnValue({ payload: 'testPayload' });
    authenticate(req, res, next);
    expect((req as CustomRequest).token).toEqual({ payload: 'testPayload' });
    expect(next).toHaveBeenCalled();
  });

  it('should call next with error when JWT validation fails', () => {
    (checkJWT as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Invalid token'));
  });

  it('should call next when authorization header is missing', () => {
    const req = { headers: {} } as Request;
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it('should call next without setting token if authorization header is invalid format', () => {
    const req = { headers: { authorization: 'InvalidToken' } } as Request; // No "Bearer"
    authenticate(req, res, next);
    expect((req as CustomRequest).token).toBeUndefined(); // Token should not be set
    expect(next).toHaveBeenCalled(); // next() should still be called
  });

  it('should call next without setting token if authorization header is "Bearer" only', () => {
    const req = { headers: { authorization: 'Bearer' } } as Request; // Only "Bearer" present
    authenticate(req, res, next);
    expect((req as CustomRequest).token).toBeUndefined(); // Token should not be set
    expect(next).toHaveBeenCalled(); // next() should still be called
  });

  it('should handle errors during JWT check and call next with the error', () => {
    const req = {
      headers: { authorization: 'Bearer invalidToken' },
    } as Request;
    (checkJWT as jest.Mock).mockImplementation(() => {
      throw new Error('JWT check failed');
    });
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('JWT check failed'));
  });
});

describe('Middleware: authorize', () => {
  let req = { token: { payload: { userId: 1 } } } as unknown as CustomRequest;
  const res = {} as Response;

  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn(); // Create a new Jest mock for next in each test
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should call next when user has required role', async () => {
    const middleware = authorize([Roles.ADMIN]);
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with NotFoundError when user is not found', async () => {
    req = { token: { payload: { userId: 100 } } } as unknown as CustomRequest;
    const middleware = authorize([Roles.ADMIN]);
    await middleware(req, res, next);
    expect(next.mock.calls[0][0]).toBeInstanceOf(NotFoundError);
  });

  it('should call next with ForbiddenError when user does not have required role', async () => {
    req = { token: { payload: { userId: 3 } } } as unknown as CustomRequest;
    const middleware = authorize([Roles.ADMIN]);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(ForbiddenError);
  });

  it('should call next when user has any of the required roles', async () => {
    req = { token: { payload: { userId: 1 } } } as unknown as CustomRequest;
    const middleware = authorize([Roles.ADMIN, Roles.DEV]);
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
