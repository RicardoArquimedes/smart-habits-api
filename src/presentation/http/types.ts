export interface LambdaHttpEvent {
  requestContext?: {
    http?: {
      method: string;
      path: string;
    };
  };
  headers?: Record<string, string | undefined>;
  body?: string;
  pathParameters?: Record<string, string | undefined>;
}

export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
