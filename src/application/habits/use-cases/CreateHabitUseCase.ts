import { Habit } from '../../../domain/habit/entities/Habit.js';
import { IHabitRepository } from '../../../domain/habit/repositories/IHabitRepository.js';
import { CreateHabitDto } from '../dtos/CreateHabitDto.js';
import { HabitResponseDto } from '../dtos/HabitResponseDto.js';

export class CreateHabitUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(dto: CreateHabitDto): Promise<HabitResponseDto> {
    const habit = Habit.create({
      title: dto.title,
      date: dto.date,
      userId: dto.userId,
    });

    await this.habitRepository.save(habit);

    return habit.toPrimitives();
  }
}
