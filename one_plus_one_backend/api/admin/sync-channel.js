import { handleCors } from '../../lib/cors.js';
import { requireAdmin } from '../../lib/adminAuth.js';
import { syncIcalChannel } from '../../lib/syncIcalChannel.js';

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  if (request.body && typeof request.body === 'string') {
    return JSON.parse(request.body);
  }

  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    request.on('error', reject);
  });
}

export default async function handler(request, response) {
      if (handleCors(request, response)) {
    return;
  }

const admin = await requireAdmin(request, response);

  if (!admin.ok) {
    return;
  }

if (request.method !== 'POST') {
    return response.status(405).json({
      ok: false,
      error: 'Method not allowed',
    });
  }

  try {
    const body = await readJsonBody(request);
    const channelName = body.channel_name;

    const result = await syncIcalChannel({
      channelName,
    });

    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
