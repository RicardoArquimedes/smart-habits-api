import crypto from 'node:crypto';

export class HabitId {
  private constructor(private readonly value: string) {}

  static create(value?: string): HabitId {
    return new HabitId(value ?? crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: HabitId): boolean {
    return this.value === other.value;
  }
}
