import bcrypt from 'bcrypt';
import { getUserByEmail } from '../../src/repositories';
import {
  checkPassword,
  checkJWT,
} from '../../src/services/authentication.service';
import { Roles, User } from '../../src/types';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../../src/config';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../src/errors';

jest.mock('../../src/repositories');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/config');

describe('Authentication Service', () => {
  describe('checkPassword', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        gender: 'male',
        firstName: 'Test',
        lastName: 'User',
        role: Roles.ADMIN,
      };
    });

    it('should return the user if email and password match', () => {
      (getUserByEmail as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const user = checkPassword('test@example.com', 'password');
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundError if user is not found', () => {
      (getUserByEmail as jest.Mock).mockReturnValue(null);

      expect(() =>
        checkPassword('nonexistent@example.com', 'password')
      ).toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError if password does not match', () => {
      (getUserByEmail as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      expect(() => checkPassword('test@example.com', 'wrongPassword')).toThrow(
        UnauthorizedError
      );
    });
  });

  describe('checkJWT', () => {
    let mockJwtPayload: JwtPayload;

    beforeEach(() => {
      mockJwtPayload = {
        sub: '1',
        aud: 'testAudience',
        iss: 'testIssuer',
      };

      (config as jest.Mocked<typeof config>).jwt = {
        secret: 'testSecret',
        audience: 'testAudience',
        issuer: 'testIssuer',
      };
    });

    it('should return the decoded JWT payload if the token is valid', () => {
      (verify as jest.Mock).mockReturnValue(mockJwtPayload);
      const token = 'Bearer validToken';

      const payload = checkJWT(token);

      expect(verify).toHaveBeenCalledWith('validToken', 'testSecret', {
        complete: true,
        audience: 'testAudience',
        issuer: 'testIssuer',
        algorithms: ['HS256'],
        clockTolerance: 0,
        ignoreExpiration: false,
        ignoreNotBefore: false,
      });
      expect(payload).toEqual(mockJwtPayload);
    });

    it('should throw BadRequestError if no token is provided', () => {
      expect(() => checkJWT('')).toThrow(BadRequestError);
    });

    it('should throw ValidationError if the token is invalid', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const token = 'Bearer invalidToken';

      expect(() => checkJWT(token)).toThrow(ValidationError);
    });

    it('should throw ValidationError if verification fails', () => {
      const token = 'Bearer invalidToken';

      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      expect(() => checkJWT(token)).toThrow(ValidationError);
    });
  });
});
