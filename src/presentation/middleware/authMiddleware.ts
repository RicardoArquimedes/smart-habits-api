import { GoogleAuthService, AuthenticatedUser } from '../../infrastructure/auth/GoogleAuthService.js';
import { LambdaHttpEvent } from '../http/types.js';

export async function extractAndVerifyToken(
  event: LambdaHttpEvent,
  authService: GoogleAuthService,
): Promise<AuthenticatedUser> {
  const authHeader =
    event.headers?.['authorization'] ??
    event.headers?.['Authorization'] ??
    '';

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    throw new UnauthorizedError('Missing authorization token');
  }

  return authService.verifyToken(token);
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
