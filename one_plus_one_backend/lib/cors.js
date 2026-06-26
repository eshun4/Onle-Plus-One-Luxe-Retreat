const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://one-plus-one-luxe-retreat.vercel.app',
];

function getAllowedOrigins() {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS;

  if (!envOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return envOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function handleCors(request, response) {
  const origin = request.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,DELETE,OPTIONS'
  );

  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  response.setHeader('Access-Control-Max-Age', '86400');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return true;
  }

  return false;
}
