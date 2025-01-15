import { Request, Response, NextFunction } from 'express';
import { getAllUsers, checkPassword } from '../../src/services';
import { sign } from 'jsonwebtoken';
import config from '../../src/config';
import { createSuccessResponse } from '../../src/utils/response';
import * as userController from '../../src/controllers/user.controller';

jest.mock('../../src/services');
jest.mock('jsonwebtoken');
jest.mock('../../src/config');
jest.mock('../../src/utils/response');

describe('userController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users on successful retrieval', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
      (createSuccessResponse as jest.Mock).mockReturnValue({ data: mockUsers });

      await userController.getUsers(req, res, next);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(createSuccessResponse).toHaveBeenCalledWith(mockUsers);
      expect(res.json).toHaveBeenCalledWith({ data: mockUsers });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const mockError = new Error('Database error');
      (getAllUsers as jest.Mock).mockRejectedValue(mockError);

      await userController.getUsers(req, res, next);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('loginUser', () => {
    it('should generate and return a JWT token on successful login', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
      req.body = { email: 'test@example.com', password: 'password' };
      (checkPassword as jest.Mock).mockResolvedValue(mockUser);
      (sign as jest.Mock).mockReturnValue('mock_token');
      (config as any).jwt = {
        secret: 'secret',
        audience: 'audience',
        issuer: 'issuer',
      };

      await userController.loginUser(req, res, next);

      expect(checkPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password'
      );
      expect(sign).toHaveBeenCalledWith(
        { userId: 1, email: 'test@example.com', role: 'user' },
        'secret',
        {
          expiresIn: '1h',
          notBefore: '0',
          algorithm: 'HS256',
          audience: 'audience',
          issuer: 'issuer',
        }
      );
      expect(createSuccessResponse).toHaveBeenCalledWith({
        token: 'mock_token',
      });
      expect(res.json).toHaveBeenCalledWith(
        createSuccessResponse({ token: 'mock_token' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on login failure', async () => {
      const mockError = new Error('Invalid credentials');
      req.body = { email: 'test@example.com', password: 'wrong_password' };
      (checkPassword as jest.Mock).mockRejectedValue(mockError);

      await userController.loginUser(req, res, next);

      expect(checkPassword).toHaveBeenCalledWith(
        'test@example.com',
        'wrong_password'
      );
      expect(sign).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });

    it('should handle missing email/password in request body', async () => {
      req.body = {}; // Missing email and password
      await userController.loginUser(req, res, next);
      expect(next).toHaveBeenCalled(); // Expect an error to be passed to next
    });
  });
});
