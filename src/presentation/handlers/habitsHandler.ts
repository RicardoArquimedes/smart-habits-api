import { GoogleAuthService } from '../../infrastructure/auth/GoogleAuthService.js';
import { CreateHabitUseCase } from '../../application/habits/use-cases/CreateHabitUseCase.js';
import { ListHabitsUseCase } from '../../application/habits/use-cases/ListHabitsUseCase.js';
import { UpdateHabitUseCase } from '../../application/habits/use-cases/UpdateHabitUseCase.js';
import { DeleteHabitUseCase } from '../../application/habits/use-cases/DeleteHabitUseCase.js';
import { HabitNotFoundError } from '../../domain/habit/errors/HabitNotFoundError.js';
import { InvalidHabitError } from '../../domain/habit/errors/InvalidHabitError.js';
import { DomainError } from '../../domain/shared/errors/DomainError.js';
import { extractAndVerifyToken, UnauthorizedError } from '../middleware/authMiddleware.js';
import {
  ok,
  created,
  badRequest,
  unauthorized,
  notFound,
  methodNotAllowed,
  internalError,
  preflight,
} from '../http/response.js';
import { LambdaHttpEvent, LambdaResponse } from '../http/types.js';

export interface HabitUseCases {
  createHabit: CreateHabitUseCase;
  listHabits: ListHabitsUseCase;
  updateHabit: UpdateHabitUseCase;
  deleteHabit: DeleteHabitUseCase;
}

export async function habitsHandler(
  event: LambdaHttpEvent,
  useCases: HabitUseCases,
  authService: GoogleAuthService,
): Promise<LambdaResponse> {
  const method = event.requestContext?.http?.method ?? '';

  if (method === 'OPTIONS') {
    return preflight();
  }

  try {
    const user = await extractAndVerifyToken(event, authService);

    if (method === 'POST') {
      const body = JSON.parse(event.body ?? '{}') as Record<string, unknown>;

      if (!body['title'] || !body['date']) {
        return badRequest('title and date are required');
      }

      const habit = await useCases.createHabit.execute({
        title: body['title'] as string,
        date: body['date'] as string,
        userId: user.userId,
      });

      return created(habit);
    }

    if (method === 'GET') {
      const habits = await useCases.listHabits.execute(user.userId);
      return ok(habits);
    }

    if (method === 'PUT') {
      const habitId = event.pathParameters?.['id'];

      if (!habitId) {
        return badRequest('habitId is required');
      }

      const body = JSON.parse(event.body ?? '{}') as Record<string, unknown>;

      const result = await useCases.updateHabit.execute({
        habitId,
        userId: user.userId,
        title: body['title'] as string | undefined,
        completed: body['completed'] as boolean | undefined,
      });

      return ok(result);
    }

    if (method === 'DELETE') {
      const habitId = event.pathParameters?.['id'];

      if (!habitId) {
        return badRequest('habitId is required');
      }

      const result = await useCases.deleteHabit.execute(user.userId, habitId);
      return ok(result);
    }

    return methodNotAllowed();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return unauthorized(error.message);
    }
    if (error instanceof HabitNotFoundError) {
      return notFound(error.message);
    }
    if (error instanceof InvalidHabitError || error instanceof DomainError) {
      return badRequest(error.message);
    }

    console.error('[habitsHandler] Unexpected error:', error);
    return internalError();
  }
}
