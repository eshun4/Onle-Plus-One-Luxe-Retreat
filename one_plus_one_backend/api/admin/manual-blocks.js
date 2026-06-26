import { handleCors } from '../../lib/cors.js';
import { requireAdmin } from '../../lib/adminAuth.js';
import { randomUUID } from 'node:crypto';
import { sql } from '../../lib/db.js';

const DEFAULT_PROPERTY_SLUG = 'one-plus-one-luxe-retreat';

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isEndAfterStart(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);

  return endDate > startDate;
}

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

async function getProperty(propertySlug = DEFAULT_PROPERTY_SLUG) {
  const properties = await sql`
    SELECT
      id,
      name,
      slug,
      public_location,
      timezone
    FROM properties
    WHERE slug = ${propertySlug}
      AND is_active = TRUE
    LIMIT 1
  `;

  return properties[0] || null;
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
      const url = new URL(request.url, `http://${request.headers.host}`);

      const propertySlug =
        url.searchParams.get('propertySlug') || DEFAULT_PROPERTY_SLUG;

      const property = await getProperty(propertySlug);

      if (!property) {
        return response.status(404).json({
          ok: false,
          error: 'Property not found',
        });
      }

      const blocks = await sql`
        SELECT
          id,
          source,
          start_date::text AS start_date,
          end_date::text AS end_date,
          status,
          reason,
          created_at,
          updated_at
        FROM availability_blocks
        WHERE property_id = ${property.id}
          AND source = 'manual'
        ORDER BY start_date ASC
      `;

      return response.status(200).json({
        ok: true,
        property: {
          name: property.name,
          slug: property.slug,
          public_location: property.public_location,
          timezone: property.timezone,
        },
        count: blocks.length,
        manual_blocks: blocks,
      });
    }

    if (request.method === 'POST') {
      const body = await readJsonBody(request);

      const propertySlug = body.propertySlug || DEFAULT_PROPERTY_SLUG;
      const startDate = body.start_date;
      const endDate = body.end_date;
      const reason = body.reason?.trim() || 'manual admin block';

      if (!startDate || !endDate) {
        return response.status(400).json({
          ok: false,
          error: 'start_date and end_date are required',
        });
      }

      if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
        return response.status(400).json({
          ok: false,
          error: 'Dates must use YYYY-MM-DD format',
        });
      }

      if (!isEndAfterStart(startDate, endDate)) {
        return response.status(400).json({
          ok: false,
          error: 'end_date must be after start_date',
        });
      }

      const property = await getProperty(propertySlug);

      if (!property) {
        return response.status(404).json({
          ok: false,
          error: 'Property not found',
        });
      }

      const blockId = randomUUID();

      try {
        const created = await sql`
          INSERT INTO availability_blocks (
            id,
            property_id,
            source,
            start_date,
            end_date,
            status,
            reason
          )
          VALUES (
            ${blockId},
            ${property.id},
            'manual',
            ${startDate},
            ${endDate},
            'active',
            ${reason}
          )
          RETURNING
            id,
            source,
            start_date::text AS start_date,
            end_date::text AS end_date,
            status,
            reason,
            created_at
        `;

        return response.status(201).json({
          ok: true,
          message: 'Manual block created',
          manual_block: created[0],
        });
      } catch (error) {
        if (
          error.message?.includes('availability_blocks_no_overlap') ||
          error.message?.includes('conflicting key value')
        ) {
          return response.status(409).json({
            ok: false,
            error: 'Those dates overlap an existing active block or reservation',
          });
        }

        throw error;
      }
    }

    if (request.method === 'DELETE') {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const id = url.searchParams.get('id');

      if (!id) {
        return response.status(400).json({
          ok: false,
          error: 'Missing required query parameter: id',
        });
      }

      const cancelled = await sql`
        UPDATE availability_blocks
        SET
          status = 'cancelled',
          reason = CONCAT(COALESCE(reason, 'manual admin block'), ' — cancelled by admin')
        WHERE id = ${id}
          AND source = 'manual'
        RETURNING
          id,
          source,
          start_date::text AS start_date,
          end_date::text AS end_date,
          status,
          reason
      `;

      if (!cancelled[0]) {
        return response.status(404).json({
          ok: false,
          error: 'Manual block not found',
        });
      }

      return response.status(200).json({
        ok: true,
        message: 'Manual block cancelled',
        manual_block: cancelled[0],
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
