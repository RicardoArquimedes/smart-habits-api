import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddb } from './dynamoClient.js';
import { Habit } from '../../../domain/habit/entities/Habit.js';
import { IHabitRepository } from '../../../domain/habit/repositories/IHabitRepository.js';

const TABLE_NAME = process.env['HABITS_TABLE'];

interface DynamoHabitRecord {
  PK: string;
  SK: string;
  habitId: string;
  title: string;
  date: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export class DynamoDBHabitRepository implements IHabitRepository {
  async save(habit: Habit): Promise<void> {
    const primitives = habit.toPrimitives();

    const item: DynamoHabitRecord = {
      PK: `USER#${primitives.userId}`,
      SK: `HABIT#${primitives.habitId}`,
      ...primitives,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );
  }

  async findById(userId: string, habitId: string): Promise<Habit | null> {
    const result = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `HABIT#${habitId}`,
        },
      }),
    );

    if (!result.Item) return null;

    const record = result.Item as DynamoHabitRecord;
    return Habit.create({
      habitId: record.habitId,
      title: record.title,
      date: record.date,
      completed: record.completed,
      createdAt: record.createdAt,
      userId: record.userId,
    });
  }

  async findAllByUserId(userId: string): Promise<Habit[]> {
    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk': 'HABIT#',
        },
      }),
    );

    return (result.Items ?? []).map((item) => {
      const record = item as DynamoHabitRecord;
      return Habit.create({
        habitId: record.habitId,
        title: record.title,
        date: record.date,
        completed: record.completed,
        createdAt: record.createdAt,
        userId: record.userId,
      });
    });
  }

  async delete(userId: string, habitId: string): Promise<void> {
    await ddb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `HABIT#${habitId}`,
        },
      }),
    );
  }
}
