import { Request, Response, NextFunction } from 'express';
import { logger, maskSensitiveData } from '../utils/logger';

/**
 * Express middleware that logs HTTP request and response details.
 *
 * This middleware performs two main functions:
 * 1. Logs incoming request details including method, URL, params, query, body, and headers
 *    with sensitive data masked for security.
 * 2. Logs response details after the request is completed, including method, URL,
 *    status code, and request duration.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @example
 * app.use(requestLogger);
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  const maskedRequest = {
    method: req.method,
    url: req.url,
    params: maskSensitiveData(req.params),
    query: maskSensitiveData(req.query),
    body: maskSensitiveData(req.body),
    headers: maskSensitiveData(req.headers),
  };

  logger.http(`Incoming Request: ${JSON.stringify(maskedRequest)}`);

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    };

    logger.http(`Response Sent: ${JSON.stringify(logMessage)}`);
  });

  next();
};
