import { logger, maskSensitiveData } from '../../src/utils/logger';
import winston from 'winston';
// Mock winston file transport
jest.mock('winston', () => {
  const originalModule = jest.requireActual('winston');
  return {
    ...originalModule,
    transports: {
      ...originalModule.transports,
      File: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        once: jest.fn(),
      })),
    },
  };
});

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create logger with correct configuration', () => {
    expect(logger).toBeInstanceOf(winston.Logger);
    expect(logger.levels).toEqual({
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    });
  });

  it('should be able to log messages', () => {
    const logSpy = jest.spyOn(logger, 'info');
    logger.info('Test message');
    expect(logSpy).toHaveBeenCalledWith('Test message');
  });
});

describe('maskSensitiveData', () => {
  it('should mask simple sensitive fields', () => {
    const input = {
      username: 'testuser',
      password: 'secret123',
      email: 'test@example.com',
    };

    const masked = maskSensitiveData(input);

    expect(masked.username).toBe('testuser');
    expect(masked.password).toBe('*********');
    expect(masked.email).toBe('****************');
  });

  it('should mask nested sensitive fields', () => {
    const input = {
      user: {
        details: {
          password: 'secret123',
          publicInfo: 'visible',
        },
      },
    };

    const masked = maskSensitiveData(input);

    expect(masked.user.details.password).toBe('*********');
    expect(masked.user.details.publicInfo).toBe('visible');
  });

  it('should handle arrays of objects with sensitive data', () => {
    const input = {
      users: [
        { id: 1, token: '12345' },
        { id: 2, token: '67890' },
      ],
    };

    const masked = maskSensitiveData(input);

    expect(masked.users[0].token).toBe('*****');
    expect(masked.users[1].token).toBe('*****');
    expect(masked.users[0].id).toBe(1);
    expect(masked.users[1].id).toBe(2);
  });

  it('should handle null and undefined values', () => {
    const input = {
      password: null,
      token: undefined,
      normalField: null,
    };

    const masked = maskSensitiveData(input);

    expect(masked.password).toBeNull();
    expect(masked.token).toBeUndefined();
    expect(masked.normalField).toBeNull();
  });
});
