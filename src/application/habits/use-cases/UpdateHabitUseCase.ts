import { IHabitRepository } from '../../../domain/habit/repositories/IHabitRepository.js';
import { HabitNotFoundError } from '../../../domain/habit/errors/HabitNotFoundError.js';
import { InvalidHabitError } from '../../../domain/habit/errors/InvalidHabitError.js';
import { UpdateHabitDto } from '../dtos/UpdateHabitDto.js';

export class UpdateHabitUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(dto: UpdateHabitDto): Promise<{ habitId: string }> {
    if (dto.title === undefined && dto.completed === undefined) {
      throw new InvalidHabitError('Nothing to update');
    }

    const habit = await this.habitRepository.findById(dto.userId, dto.habitId);

    if (!habit) {
      throw new HabitNotFoundError(dto.habitId);
    }

    let updated = habit;
    if (dto.title !== undefined) updated = updated.updateTitle(dto.title);
    if (dto.completed !== undefined) updated = updated.updateCompleted(dto.completed);

    await this.habitRepository.save(updated);

    return { habitId: dto.habitId };
  }
}
