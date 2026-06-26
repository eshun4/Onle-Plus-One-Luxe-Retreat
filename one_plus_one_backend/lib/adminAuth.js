import * as jose from 'jose';

let cachedJwks = null;

function getAuthBaseUrl() {
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;

  if (!authBaseUrl) {
    throw new Error('Missing NEON_AUTH_BASE_URL');
  }

  return authBaseUrl.replace(/\/$/, '');
}

function getJwksUrl() {
  return `${getAuthBaseUrl()}/.well-known/jwks.json`;
}

function getIssuer() {
  return new URL(getAuthBaseUrl()).origin;
}

function getJwks() {
  if (!cachedJwks) {
    cachedJwks = jose.createRemoteJWKSet(new URL(getJwksUrl()));
  }

  return cachedJwks;
}

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function sendUnauthorized(response, message = 'Unauthorized') {
  response.status(401).json({
    ok: false,
    error: message,
  });

  return {
    ok: false,
  };
}

export async function requireAdmin(request, response) {
  try {
    const authHeader = request.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(response);
    }

    const token = authHeader.slice('Bearer '.length).trim();

    const { payload, protectedHeader } = await jose.jwtVerify(token, getJwks(), {
      issuer: getIssuer(),
    });

    const email = payload.email?.toLowerCase();

    if (!payload.sub || !email) {
      return sendUnauthorized(response, 'Invalid token');
    }

    const allowedAdminEmails = getAllowedAdminEmails();

    if (!allowedAdminEmails.includes(email)) {
      return response.status(403).json({
        ok: false,
        error: 'Forbidden',
      });
    }

    return {
      ok: true,
      user: {
        id: payload.sub,
        email,
        kid: protectedHeader.kid,
      },
    };
  } catch (error) {
    console.error('Admin auth verification failed:', {
      name: error.name,
      code: error.code,
      message: error.message,
      jwksUrl: getJwksUrl(),
      issuer: getIssuer(),
    });

    return sendUnauthorized(response, 'Invalid or expired token');
  }
}
