export class HabitDate {
  private static readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  private constructor(private readonly value: string) {}

  static create(value: string): HabitDate {
    if (!value || value.trim().length === 0) {
      throw new Error('HabitDate cannot be empty');
    }
    if (!HabitDate.DATE_REGEX.test(value.trim())) {
      throw new Error('HabitDate must be in YYYY-MM-DD format');
    }
    return new HabitDate(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: HabitDate): boolean {
    return this.value === other.value;
  }
}
