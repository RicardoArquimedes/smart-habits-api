import { DomainError } from '../../shared/errors/DomainError.js';

export class HabitNotFoundError extends DomainError {
  constructor(habitId: string) {
    super(`Habit with id "${habitId}" not found`);
  }
}
