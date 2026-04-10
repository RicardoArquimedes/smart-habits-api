import { OAuth2Client } from 'google-auth-library';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client();
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    const ticket = await this.client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token: empty payload');
    }

    return {
      userId: payload.sub,
      email: payload.email ?? '',
      name: payload.name ?? '',
    };
  }
}
