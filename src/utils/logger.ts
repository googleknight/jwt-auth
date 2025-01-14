/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';

// Define logging levels with numeric priorities
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

// Add colors to Winston
winston.addColors(colors);

// Configure log format with timestamp, colors and custom print format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Define transport - console output
const transports = [new winston.transports.Console()];

// Create and export Winston logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

// Function to mask sensitive data in objects
export const maskSensitiveData = (data: any): any => {
  if (!data) return data;

  const maskedData = { ...data };
  // List of fields that should be masked
  const sensitiveFields = [
    'password',
    'token',
    'authorization',
    'cookie',
    'creditCard',
    'ssn',
    'email',
  ];

  // Helper function to mask individual values
  const maskValue = (value: any): any => {
    if (!value) return value;
    if (typeof value === 'string') {
      return value.replace(/./g, '*');
    }
    return value;
  };

  // Recursive function to mask objects
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
