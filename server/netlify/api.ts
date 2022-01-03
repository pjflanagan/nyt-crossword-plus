
const HEADERS = {
  'Access-Control-Allow-Origin': '*', // https://www.nytimes.com, https://nytcrossword.flanny.app
  'Content-Type': 'application/json',
};

export const errorResponse = (statusCode: number, message: string) => {
  console.error(message);
  return {
    statusCode: statusCode || 500,
    headers: HEADERS,
    body: JSON.stringify({
      errorMessage: message
    })
  }
}

export const validResponse = (body: any) => {
  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({
      ...body,
      errorMessage: '',
    })
  };
}
