import {
  createSuccessResponse,
  createErrorResponse,
} from '../../src/utils/response';
import { ApiErrorResponse, ApiSuccessResponse } from '../../src/types/response';

describe('Response Utils', () => {
  it('should create a successful response', () => {
    const data = { name: 'John Doe', age: 30 };
    const message = 'User created successfully';
    const response: ApiSuccessResponse<{ name: string; age: number }> =
      createSuccessResponse(data, message);

    expect(response).toEqual({
      success: true,
      data: data,
      message: message,
      timestamp: expect.any(String),
    });

    // Check if the timestamp is a valid ISO string
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });

  it('should create a successful response without a message', () => {
    const data = [1, 2, 3];
    const response: ApiSuccessResponse<number[]> = createSuccessResponse(data);

    expect(response).toEqual({
      success: true,
      data: data,
      message: undefined, // Ensure message is undefined when not provided
      timestamp: expect.any(String),
    });

    // Check if the timestamp is a valid ISO string
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });

  it('should create an error response', () => {
    const code = 400;
    const message = 'Bad Request';
    const details = { field: 'name', error: 'Required' };
    const response: ApiErrorResponse = createErrorResponse(
      code,
      message,
      details
    );

    expect(response).toEqual({
      success: false,
      error: {
        code: code,
        message: message,
        details: details,
      },
      timestamp: expect.any(String),
    });

    // Check if the timestamp is a valid ISO string
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });

  it('should create an error response without details', () => {
    const code = 500;
    const message = 'Internal Server Error';
    const response: ApiErrorResponse = createErrorResponse(code, message);

    expect(response).toEqual({
      success: false,
      error: {
        code: code,
        message: message,
        details: undefined, // Ensure details is undefined when not provided
      },
      timestamp: expect.any(String),
    });

    // Check if the timestamp is a valid ISO string
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });
});
