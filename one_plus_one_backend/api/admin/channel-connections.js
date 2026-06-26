import { handleCors } from '../../lib/cors.js';
import { requireAdmin } from '../../lib/adminAuth.js';
import { sql } from '../../lib/db.js';

const VALID_CHANNELS = new Set(['booking_com', 'airbnb', 'vrbo', 'direct']);

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

  try {
    if (request.method === 'GET') {
      const connections = await sql`
        SELECT
          cc.id,
          cc.channel_name,
          cc.ical_import_url,
          cc.ical_export_token,
          cc.is_active,
          cc.last_synced_at,
          cc.last_sync_status,
          cc.last_sync_error,
          p.name AS property_name,
          p.slug AS property_slug
        FROM channel_connections cc
        JOIN properties p
          ON p.id = cc.property_id
        ORDER BY cc.channel_name ASC
      `;

      return response.status(200).json({
        ok: true,
        count: connections.length,
        channel_connections: connections,
      });
    }

    if (request.method === 'POST' || request.method === 'PATCH') {
      const body = await readJsonBody(request);

      const channelName = body.channel_name;
      const icalImportUrl = body.ical_import_url || null;
      const isActive =
        typeof body.is_active === 'boolean' ? body.is_active : true;

      if (!VALID_CHANNELS.has(channelName)) {
        return response.status(400).json({
          ok: false,
          error: 'Invalid channel_name. Use booking_com, airbnb, vrbo, or direct.',
        });
      }

      const updated = await sql`
        UPDATE channel_connections
        SET
          ical_import_url = ${icalImportUrl},
          is_active = ${isActive}
        WHERE channel_name = ${channelName}
        RETURNING
          id,
          channel_name,
          ical_import_url,
          ical_export_token,
          is_active,
          last_synced_at,
          last_sync_status,
          last_sync_error
      `;

      if (!updated[0]) {
        return response.status(404).json({
          ok: false,
          error: 'Channel connection not found',
        });
      }

      return response.status(200).json({
        ok: true,
        channel_connection: updated[0],
      });
    }

    return response.status(405).json({
      ok: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
