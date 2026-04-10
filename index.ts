import { DynamoDBHabitRepository } from './src/infrastructure/persistence/dynamodb/DynamoDBHabitRepository.js';
import { GoogleAuthService } from './src/infrastructure/auth/GoogleAuthService.js';
import { CreateHabitUseCase } from './src/application/habits/use-cases/CreateHabitUseCase.js';
import { ListHabitsUseCase } from './src/application/habits/use-cases/ListHabitsUseCase.js';
import { UpdateHabitUseCase } from './src/application/habits/use-cases/UpdateHabitUseCase.js';
import { DeleteHabitUseCase } from './src/application/habits/use-cases/DeleteHabitUseCase.js';
import { healthHandler } from './src/presentation/handlers/healthHandler.js';
import { habitsHandler, HabitUseCases } from './src/presentation/handlers/habitsHandler.js';
import { LambdaHttpEvent, LambdaResponse } from './src/presentation/http/types.js';

// ── Composition Root ──────────────────────────────────────────────────────────
// Instantiated once per Lambda cold start; reused across warm invocations.

const habitRepository = new DynamoDBHabitRepository();
const authService = new GoogleAuthService();

const useCases: HabitUseCases = {
  createHabit: new CreateHabitUseCase(habitRepository),
  listHabits: new ListHabitsUseCase(habitRepository),
  updateHabit: new UpdateHabitUseCase(habitRepository),
  deleteHabit: new DeleteHabitUseCase(habitRepository),
};

// ── Lambda Handler ────────────────────────────────────────────────────────────

export async function handler(event: LambdaHttpEvent): Promise<LambdaResponse> {
  const path = event.requestContext?.http?.path ?? '';
  const method = event.requestContext?.http?.method ?? '';

  console.log(`[${method}] ${path}`);

  if (path.endsWith('/health')) {
    return healthHandler();
  }

  if (path.includes('/habits')) {
    return habitsHandler(event, useCases, authService);
  }

  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Route not found' }),
  };
}
