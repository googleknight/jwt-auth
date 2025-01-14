import { Request, Response, NextFunction } from 'express';
import { checkJWT } from '../services';
import { CustomRequest, Roles } from '../types';
import { getUser } from '../repositories';
import { ForbiddenError, NotFoundError } from '../errors';

/**
 * Middleware function to authenticate incoming requests using JWT.
 * Extracts the JWT from the Authorization header and validates it.
 * If valid, attaches the JWT payload to the request object for use in subsequent middleware.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @throws Will pass any JWT validation errors to the next error handler
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = <string>req.headers['authorization'];
  try {
    const jwtPayload = checkJWT(token);
    if (jwtPayload) {
      (req as CustomRequest).token = jwtPayload;
    }
  } catch (error) {
    next(error);
  }

  next();
};
/**
 * Creates a middleware function to authorize requests based on user roles.
 * Verifies if the authenticated user has one of the required roles.
 * The user ID is extracted from the JWT payload attached to the request.
 *
 * @param roles - Array of allowed roles that can access the route
 * @returns Middleware function that checks user authorization
 * @throws NotFoundError if the user doesn't exist
 * @throws ForbiddenError if the user's role is not in the allowed roles array
 */
export const authorize = (roles: Array<Roles>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = getUser((req as CustomRequest).token.payload.userId);

    if (!user) {
      next(new NotFoundError('User not found'));
      return;
    }

    if (roles.indexOf(user.role) > -1) next();
    else {
      next(new ForbiddenError('You are not allowed to perform this action'));
    }
  };
};
