export async function health() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      service: 'smart-habits-api',
    }),
  };
}
