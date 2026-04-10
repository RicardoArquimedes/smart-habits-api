import { DomainError } from '../../shared/errors/DomainError.js';

export class InvalidHabitError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
