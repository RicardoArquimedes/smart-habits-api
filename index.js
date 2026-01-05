import { health } from './src/handlers/health.js';
import { habits } from './src/handlers/habits.js';

export async function handler(event) {
  console.log("el evet", event)
  const path = event.requestContext?.http?.path ?? '';
  const method = event.requestContext?.http?.method ?? '';

  // Health
  if (path.endsWith('/health')) {
    return health();
  }

  // Habits (incluye /habits y /habits/{id})
  if (path.includes('/habits')) {
    return habits(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Route not found' }),
  };
}
