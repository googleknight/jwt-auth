// @ts-nocheck
import { Request, Response } from 'express';
import { requestLogger } from '../../src/middlewares';
import { logger } from '../../src/utils/logger';

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    http: jest.fn(),
  },
  maskSensitiveData: jest.requireActual('../../src/utils/logger')
    .maskSensitiveData,
}));

describe('requestLogger middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let mockResOnCallback: Function;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockReq = {
      method: 'GET',
      url: '/test',
      params: {},
      query: {},
      body: {},
      headers: {},
    };

    mockRes = {
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          mockResOnCallback = callback;
        }
      }),
      statusCode: 200,
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should log incoming requests', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(logger.http).toHaveBeenCalledWith(
      expect.stringContaining('Incoming Request')
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should mask sensitive data in request logs', () => {
    mockReq.headers = {
      authorization: 'Bearer secret-token',
      'content-type': 'application/json',
    };
    mockReq.body = {
      password: 'secret123',
      email: 'test@example.com',
      name: 'John',
    };

    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    const logCall = (logger.http as jest.Mock).mock.calls[0][0];
    expect(logCall).not.toContain('secret-token');
    expect(logCall).not.toContain('secret123');
    expect(logCall).toContain('John');
  });

  it('should log response completion with timing', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    // Simulate some time passing
    jest.advanceTimersByTime(100);

    // Simulate response finish
    mockResOnCallback();

    expect(logger.http).toHaveBeenCalledTimes(2);
    expect(logger.http).toHaveBeenLastCalledWith(
      expect.stringContaining('Response Sent')
    );
    expect(logger.http).toHaveBeenLastCalledWith(
      expect.stringContaining('100ms')
    );
  });
});
