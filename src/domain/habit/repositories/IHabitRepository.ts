import { Habit } from '../entities/Habit.js';

export interface IHabitRepository {
  save(habit: Habit): Promise<void>;
  findById(userId: string, habitId: string): Promise<Habit | null>;
  findAllByUserId(userId: string): Promise<Habit[]>;
  delete(userId: string, habitId: string): Promise<void>;
}
