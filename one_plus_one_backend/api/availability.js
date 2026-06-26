import { handleCors } from '../lib/cors.js';
import { sql } from '../lib/db.js';

const DEFAULT_PROPERTY_SLUG = 'one-plus-one-luxe-retreat';

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isEndAfterStart(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);

  return endDate > startDate;
}

export default async function handler(request, response) {
    if (handleCors(request, response)) {
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

    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    if (!start || !end) {
      return response.status(400).json({
        ok: false,
        error: 'Missing required query parameters: start and end',
        example:
          '/api/availability?start=2026-07-01&end=2026-07-31',
      });
    }

    if (!isValidDateString(start) || !isValidDateString(end)) {
      return response.status(400).json({
        ok: false,
        error: 'Dates must use YYYY-MM-DD format',
      });
    }

    if (!isEndAfterStart(start, end)) {
      return response.status(400).json({
        ok: false,
        error: 'end date must be after start date',
      });
    }

    const properties = await sql`
      SELECT
        id,
        name,
        slug,
        public_location,
        timezone,
        currency,
        max_guests,
        base_nightly_rate_cents
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

    const blockedRanges = await sql`
      SELECT
        id,
        source,
        start_date::text AS start_date,
        end_date::text AS end_date,
        status,
        reason
      FROM availability_blocks
      WHERE property_id = ${property.id}
        AND status = 'active'
        AND daterange(start_date, end_date, '[)') &&
            daterange(${start}::date, ${end}::date, '[)')
      ORDER BY start_date ASC
    `;

    return response.status(200).json({
      ok: true,
      property: {
        name: property.name,
        slug: property.slug,
        public_location: property.public_location,
        timezone: property.timezone,
        currency: property.currency,
        max_guests: property.max_guests,
        base_nightly_rate_cents: property.base_nightly_rate_cents,
      },
      query: {
        start,
        end,
      },
      blocked_ranges: blockedRanges,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
