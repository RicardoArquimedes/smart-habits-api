import { LambdaResponse } from '../http/types.js';
import { ok } from '../http/response.js';

export function healthHandler(): LambdaResponse {
  return ok({ status: 'ok', service: 'smart-habits-api' });
}
