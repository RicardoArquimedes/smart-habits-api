import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import crypto from 'node:crypto';
import { ddb } from '../lib/dynamo.js';
import { verifyGoogleToken } from '../lib/auth.js';

const TABLE_NAME = process.env.HABITS_TABLE;

// =========================
// CORS (GLOBAL)
// =========================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

export async function habits(event) {
  try {
    const method = event.requestContext?.http?.method;

    // =========================
    // PRE-FLIGHT (CORS)
    // =========================
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }

    // =========================
    // AUTH
    // =========================
    const authHeader =
      event.headers?.authorization ||
      event.headers?.Authorization ||
      '';

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: 'Unauthorized',
      };
    }

    const user = await verifyGoogleToken(token);

    // =========================
    // CREATE (POST)
    // =========================
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');

      if (!body.title || !body.date) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: 'title and date are required',
        };
      }

const habitId = crypto.randomUUID();

const item = {
  PK: `USER#${user.userId}`,
  SK: `HABIT#${habitId}`,

  habitId,          // 👈 mismo id
  title: body.title,
  date: body.date,
  completed: false,
  createdAt: new Date().toISOString(),
  userId: user.userId,
};


      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(item),
      };
    }

    // =========================
    // READ (GET)
    // =========================
    if (method === 'GET') {
      const pk = `USER#${user.userId}`;

      const result = await ddb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
          ExpressionAttributeValues: {
            ':pk': pk,
            ':sk': 'HABIT#',
          },
        })
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Items ?? []),
      };
    }

    // =========================
    // UPDATE (PUT)
    // =========================
if (method === 'PUT') {
  const habitId = event.pathParameters?.id;
  const body = JSON.parse(event.body || '{}');

  if (!habitId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'habitId is required',
    };
  }

  const pk = `USER#${user.userId}`;
  const sk = `HABIT#${habitId}`;

  const updateExp = [];
  const values = {};

  if (body.title !== undefined) {
    updateExp.push('title = :title');
    values[':title'] = body.title;
  }

  if (body.completed !== undefined) {
    updateExp.push('completed = :completed');
    values[':completed'] = body.completed;
  }

  if (updateExp.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Nothing to update',
    };
  }

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${updateExp.join(', ')}`,
      ExpressionAttributeValues: values,
    })
  );

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ habitId }),
  };
}

    // =========================
    // DELETE
    // =========================
if (method === 'DELETE') {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'id is required',
    };
  }

  const pk = `USER#${user.userId}`;
  const sk = `HABIT#${id}`;

  await ddb.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true }),
  };
}

    // =========================
    // METHOD NOT ALLOWED
    // =========================
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed',
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
}
