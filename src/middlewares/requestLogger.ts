import { Request, Response, NextFunction } from 'express';
import { logger, maskSensitiveData } from '../utils/logger';

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
