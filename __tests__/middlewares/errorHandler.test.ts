import { Request, Response } from 'express';
import { errorHandler } from '../../src/middlewares/errorHandler';
import { CustomError } from '../../src/errors';
import { createErrorResponse } from '../../src/utils/response';
import { logger } from '../../src/utils/logger';

// Mock logger.error to avoid console output during tests

jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn().mockReturnThis(), // Important: return this
    info: jest.fn().mockReturnThis(), // And for other methods you might use
  },
}));
// Mock createErrorResponse for consistent testing
jest.mock('../../src/utils/response', () => ({
  createErrorResponse: jest.fn((statusCode, message, details?) => ({
    statusCode,
    message,
    details,
  })),
}));

const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;
const mockNext = jest.fn();

describe('errorHandler middleware', () => {
  it('should handle CustomError correctly', () => {
    const customError = new CustomError(400, 'Bad Request', ['Invalid input']);
    errorHandler(customError, mockRequest, mockResponse, mockNext);

    expect(logger.error).toHaveBeenCalledWith('Error:', customError);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(createErrorResponse).toHaveBeenCalledWith(400, 'Bad Request', [
      'Invalid input',
    ]);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Bad Request',
      details: ['Invalid input'],
    });
  });

  it('should handle generic errors with 500 status code', () => {
    const genericError = new Error('Something went wrong');
    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(logger.error).toHaveBeenCalledWith('Error:', genericError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);

    const expectedDetails =
      process.env.NODE_ENV === 'development' ? genericError.stack : undefined;
    expect(createErrorResponse).toHaveBeenCalledWith(
      500,
      'Internal Server Error',
      expectedDetails
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal Server Error',
      details: expectedDetails,
    });
  });

  it('should include stack trace in development environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const genericError = new Error('Dev error');
    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(createErrorResponse).toHaveBeenCalledWith(
      500,
      'Internal Server Error',
      genericError.stack
    );

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should not include stack trace in production environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const genericError = new Error('Prod error');
    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(createErrorResponse).toHaveBeenCalledWith(
      500,
      'Internal Server Error',
      undefined
    );

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
