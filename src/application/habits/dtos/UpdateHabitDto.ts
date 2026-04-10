export interface UpdateHabitDto {
  habitId: string;
  userId: string;
  title?: string;
  completed?: boolean;
}
