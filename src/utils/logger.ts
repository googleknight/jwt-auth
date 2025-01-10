/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

const transports = [new winston.transports.Console()];

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

// Sensitive data masking function
export const maskSensitiveData = (data: any): any => {
  if (!data) return data;

  const maskedData = { ...data };
  const sensitiveFields = [
    'password',
    'token',
    'authorization',
    'cookie',
    'creditCard',
    'ssn',
    'email',
  ];

  const maskValue = (value: any): any => {
    if (!value) return value;
    if (typeof value === 'string') {
      return value.replace(/./g, '*');
    }
    return value;
  };

  const maskObject = (obj: any): any => {
    const masked = { ...obj };
    for (const key in masked) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        masked[key] = maskValue(masked[key]);
      } else if (typeof masked[key] === 'object') {
        masked[key] = maskSensitiveData(masked[key]);
      }
    }
    return masked;
  };

  return maskObject(maskedData);
};
