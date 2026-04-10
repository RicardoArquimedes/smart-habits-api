import { IHabitRepository } from '../../../domain/habit/repositories/IHabitRepository.js';
import { HabitResponseDto } from '../dtos/HabitResponseDto.js';

export class ListHabitsUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(userId: string): Promise<HabitResponseDto[]> {
    const habits = await this.habitRepository.findAllByUserId(userId);
    return habits.map((habit) => habit.toPrimitives());
  }
}
