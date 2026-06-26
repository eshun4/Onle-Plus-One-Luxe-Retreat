import { handleCors } from '../../lib/cors.js';
import { requireAdmin } from '../../lib/adminAuth.js';
import { sql } from '../../lib/db.js';

const DEFAULT_PROPERTY_SLUG = 'one-plus-one-luxe-retreat';

const VALID_SOURCES = new Set([
  'booking_com',
  'airbnb',
  'vrbo',
  'direct',
  'manual',
]);

const VALID_STATUSES = new Set([
  'pending',
  'confirmed',
  'cancelled',
  'hold',
]);

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default async function handler(request, response) {
      if (handleCors(request, response)) {
    return;
  }

const admin = await requireAdmin(request, response);

  if (!admin.ok) {
    return;
  }

if (request.method !== 'GET') {
    return response.status(405).json({
      ok: false,
      error: 'Method not allowed',
    });
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    const propertySlug =
      url.searchParams.get('propertySlug') || DEFAULT_PROPERTY_SLUG;

    const source = url.searchParams.get('source');
    const status = url.searchParams.get('status');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    if (source && !VALID_SOURCES.has(source)) {
      return response.status(400).json({
        ok: false,
        error: `Invalid source. Use one of: ${Array.from(VALID_SOURCES).join(', ')}`,
      });
    }

    if (status && !VALID_STATUSES.has(status)) {
      return response.status(400).json({
        ok: false,
        error: `Invalid status. Use one of: ${Array.from(VALID_STATUSES).join(', ')}`,
      });
    }

    if (start && !isValidDateString(start)) {
      return response.status(400).json({
        ok: false,
        error: 'start must use YYYY-MM-DD format',
      });
    }

    if (end && !isValidDateString(end)) {
      return response.status(400).json({
        ok: false,
        error: 'end must use YYYY-MM-DD format',
      });
    }

    const properties = await sql`
      SELECT
        id,
        name,
        slug,
        public_location,
        timezone,
        currency
      FROM properties
      WHERE slug = ${propertySlug}
        AND is_active = TRUE
      LIMIT 1
    `;

    const property = properties[0];

    if (!property) {
      return response.status(404).json({
        ok: false,
        error: 'Property not found',
      });
    }

    const reservations = await sql`
      SELECT
        r.id,
        r.source,
        r.source_reservation_id,
        r.source_event_uid,
        r.guest_name,
        r.guest_email,
        r.guest_phone,
        r.guest_count,
        r.check_in::text AS check_in,
        r.check_out::text AS check_out,
        r.status,
        r.total_price_cents,
        r.currency,
        r.notes,
        r.created_at,
        r.updated_at,
        ab.id AS availability_block_id,
        ab.status AS availability_block_status
      FROM reservations r
      LEFT JOIN availability_blocks ab
        ON ab.reservation_id = r.id
      WHERE r.property_id = ${property.id}
        AND (${source}::text IS NULL OR r.source = ${source})
        AND (${status}::text IS NULL OR r.status = ${status})
        AND (${start}::date IS NULL OR r.check_out > ${start}::date)
        AND (${end}::date IS NULL OR r.check_in < ${end}::date)
      ORDER BY r.check_in ASC, r.created_at DESC
    `;

    return response.status(200).json({
      ok: true,
      property: {
        name: property.name,
        slug: property.slug,
        public_location: property.public_location,
        timezone: property.timezone,
        currency: property.currency,
      },
      filters: {
        source: source || null,
        status: status || null,
        start: start || null,
        end: end || null,
      },
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
