import { NextFunction, Request, Response } from 'express';
import { getAllUsers, checkPassword } from '../services';
import { sign } from 'jsonwebtoken';

import config from '../config';
import { createSuccessResponse } from '../utils/response';

/**
 * Retrieves all users from the database.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns Promise<void>
 *
 * This endpoint handler:
 * 1. Calls getAllUsers service to fetch users from database
 * 2. Returns success response with users data
 * 3. Passes any errors to error handling middleware
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(createSuccessResponse(users));
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param req - Express Request object containing email and password in body
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns Promise<void>
 *
 * This endpoint handler:
 * 1. Extracts email and password from request body
 * 2. Validates credentials using checkPassword service
 * 3. Generates a JWT token containing user information
 * 4. Returns success response with the token
 * 5. Passes any authentication errors to error handling middleware
 *
 * The JWT token includes:
 * - userId
 * - email
 * - role
 * And is configured with:
 * - 1 hour expiration
 * - Immediate validity (notBefore: '0')
 * - HS256 algorithm
 * - Configured audience and issuer
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await checkPassword(email, password);

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret!,
      {
        expiresIn: '1h',
        notBefore: '0',
        algorithm: 'HS256',
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
      }
    );

    res.json(createSuccessResponse({ token }));
  } catch (error) {
    next(error);
  }
};
