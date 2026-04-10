export class HabitTitle {
  private static readonly MAX_LENGTH = 200;

  private constructor(private readonly value: string) {}

  static create(value: string): HabitTitle {
    if (!value || value.trim().length === 0) {
      throw new Error('HabitTitle cannot be empty');
    }
    if (value.trim().length > HabitTitle.MAX_LENGTH) {
      throw new Error(`HabitTitle cannot exceed ${HabitTitle.MAX_LENGTH} characters`);
    }
    return new HabitTitle(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: HabitTitle): boolean {
    return this.value === other.value;
  }
}
