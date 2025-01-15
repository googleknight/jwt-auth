import bcrypt from 'bcrypt';
import { getUserByEmail } from '../repositories';
import { User } from '../types';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../errors';

/**
 * Validates user credentials by checking if the provided email exists and the password matches.
 *
 * @param email - The email address of the user attempting to authenticate
 * @param password - The plain text password to verify
 * @returns The user object if authentication is successful
 * @throws {NotFoundError} When no user is found with the provided email
 * @throws {UnauthorizedError} When the provided password doesn't match the stored hash
 */
export const checkPassword = (email: string, password: string): User => {
  const user = getUserByEmail(email);
  if (!user) throw new NotFoundError('User not found');
  if (bcrypt.compareSync(password, user.password)) {
    return user;
  }
  throw new UnauthorizedError('Wrong password for user');
};

/**
 * Validates and decodes a JWT token.
 *
 * @param token - The JWT token to verify, expected in 'Bearer <token>' format
 * @returns The decoded JWT payload if verification is successful
 * @throws {BadRequestError} When no token is provided
 * @throws {ValidationError} When the token is invalid or verification fails
 */
export const checkJWT = (token: string): JwtPayload => {
  if (!token) throw new BadRequestError('Token not found');
  try {
    return verify(token.split(' ')[1], config.jwt.secret!, {
      complete: true,
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      algorithms: ['HS256'],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
  } catch (error) {
    throw new ValidationError('Invalid JWT token', error);
  }
};
