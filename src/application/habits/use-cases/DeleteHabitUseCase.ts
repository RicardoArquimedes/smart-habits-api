import { IHabitRepository } from '../../../domain/habit/repositories/IHabitRepository.js';

export class DeleteHabitUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(userId: string, habitId: string): Promise<{ success: boolean }> {
    await this.habitRepository.delete(userId, habitId);
    return { success: true };
  }
}
