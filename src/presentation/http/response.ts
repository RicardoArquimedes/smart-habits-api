import { LambdaResponse } from './types.js';

const CORS_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export const ok = (body: unknown): LambdaResponse => ({
  statusCode: 200,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});

export const created = (body: unknown): LambdaResponse => ({
  statusCode: 201,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});

export const noContent = (): LambdaResponse => ({
  statusCode: 204,
  headers: CORS_HEADERS,
  body: '',
});

export const badRequest = (message: string): LambdaResponse => ({
  statusCode: 400,
  headers: CORS_HEADERS,
  body: JSON.stringify({ message }),
});

export const unauthorized = (message = 'Unauthorized'): LambdaResponse => ({
  statusCode: 401,
  headers: CORS_HEADERS,
  body: JSON.stringify({ message }),
});

export const notFound = (message: string): LambdaResponse => ({
  statusCode: 404,
  headers: CORS_HEADERS,
  body: JSON.stringify({ message }),
});

export const methodNotAllowed = (): LambdaResponse => ({
  statusCode: 405,
  headers: CORS_HEADERS,
  body: JSON.stringify({ message: 'Method Not Allowed' }),
});

export const internalError = (message = 'Internal server error'): LambdaResponse => ({
  statusCode: 500,
  headers: CORS_HEADERS,
  body: JSON.stringify({ message }),
});

export const preflight = (): LambdaResponse => ({
  statusCode: 200,
  headers: CORS_HEADERS,
  body: '',
});
