import { HabitId } from '../value-objects/HabitId.js';
import { HabitTitle } from '../value-objects/HabitTitle.js';
import { HabitDate } from '../value-objects/HabitDate.js';
import { UserId } from '../../shared/value-objects/UserId.js';

interface HabitProps {
  habitId: HabitId;
  title: HabitTitle;
  date: HabitDate;
  completed: boolean;
  createdAt: string;
  userId: UserId;
}

export interface HabitPrimitives {
  habitId: string;
  title: string;
  date: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export class Habit {
  private constructor(private readonly props: HabitProps) {}

  static create(params: {
    title: string;
    date: string;
    userId: string;
    habitId?: string;
    completed?: boolean;
    createdAt?: string;
  }): Habit {
    return new Habit({
      habitId: HabitId.create(params.habitId),
      title: HabitTitle.create(params.title),
      date: HabitDate.create(params.date),
      completed: params.completed ?? false,
      createdAt: params.createdAt ?? new Date().toISOString(),
      userId: UserId.create(params.userId),
    });
  }

  get habitId(): HabitId {
    return this.props.habitId;
  }

  get title(): HabitTitle {
    return this.props.title;
  }

  get date(): HabitDate {
    return this.props.date;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  updateTitle(title: string): Habit {
    return new Habit({ ...this.props, title: HabitTitle.create(title) });
  }

  updateCompleted(completed: boolean): Habit {
    return new Habit({ ...this.props, completed });
  }

  toPrimitives(): HabitPrimitives {
    return {
      habitId: this.props.habitId.getValue(),
      title: this.props.title.getValue(),
      date: this.props.date.getValue(),
      completed: this.props.completed,
      createdAt: this.props.createdAt,
      userId: this.props.userId.getValue(),
    };
  }
}
