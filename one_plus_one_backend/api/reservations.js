import { handleCors } from '../lib/cors.js';
import { randomUUID } from 'node:crypto';
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

function calculateNights(checkIn, checkOut) {
  const startDate = new Date(`${checkIn}T00:00:00Z`);
  const endDate = new Date(`${checkOut}T00:00:00Z`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((endDate - startDate) / millisecondsPerDay);
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

export default async function handler(request, response) {
    if (handleCors(request, response)) {
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

    const propertySlug = body.propertySlug || DEFAULT_PROPERTY_SLUG;
    const checkIn = body.check_in;
    const checkOut = body.check_out;
    const guestCount = Number(body.guest_count || 1);

    const guestName = body.guest_name?.trim() || null;
    const guestEmail = body.guest_email?.trim() || null;
    const guestPhone = body.guest_phone?.trim() || null;
    const notes = body.notes?.trim() || null;

    if (!checkIn || !checkOut) {
      return response.status(400).json({
        ok: false,
        error: 'check_in and check_out are required',
      });
    }

    if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) {
      return response.status(400).json({
        ok: false,
        error: 'Dates must use YYYY-MM-DD format',
      });
    }

    if (!isEndAfterStart(checkIn, checkOut)) {
      return response.status(400).json({
        ok: false,
        error: 'check_out must be after check_in',
      });
    }

    if (!guestName) {
      return response.status(400).json({
        ok: false,
        error: 'guest_name is required',
      });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return response.status(400).json({
        ok: false,
        error: 'guest_count must be a whole number greater than 0',
      });
    }

    const properties = await sql`
      SELECT
        id,
        name,
        slug,
        max_guests,
        currency,
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

    if (guestCount > property.max_guests) {
      return response.status(400).json({
        ok: false,
        error: `This property allows a maximum of ${property.max_guests} guests`,
      });
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPriceCents = nights * property.base_nightly_rate_cents;

    const reservationId = randomUUID();
    const blockId = randomUUID();

    try {
      const [reservationResult, blockResult] = await sql.transaction([
        sql`
          INSERT INTO reservations (
            id,
            property_id,
            source,
            source_reservation_id,
            guest_name,
            guest_email,
            guest_phone,
            guest_count,
            check_in,
            check_out,
            status,
            total_price_cents,
            currency,
            notes,
            raw_payload
          )
          VALUES (
            ${reservationId},
            ${property.id},
            'direct',
            ${reservationId},
            ${guestName},
            ${guestEmail},
            ${guestPhone},
            ${guestCount},
            ${checkIn},
            ${checkOut},
            'pending',
            ${totalPriceCents},
            ${property.currency},
            ${notes},
            ${JSON.stringify(body)}
          )
          RETURNING
            id,
            source,
            guest_name,
            guest_count,
            check_in::text AS check_in,
            check_out::text AS check_out,
            status,
            total_price_cents,
            currency
        `,
        sql`
          INSERT INTO availability_blocks (
            id,
            property_id,
            reservation_id,
            source,
            start_date,
            end_date,
            status,
            reason,
            external_uid
          )
          VALUES (
            ${blockId},
            ${property.id},
            ${reservationId},
            'direct',
            ${checkIn},
            ${checkOut},
            'active',
            'direct website reservation hold',
            ${reservationId}
          )
          RETURNING
            id,
            source,
            start_date::text AS start_date,
            end_date::text AS end_date,
            status,
            reason
        `,
      ]);

      return response.status(201).json({
        ok: true,
        message: 'Reservation request created and dates blocked',
        property: {
          name: property.name,
          slug: property.slug,
        },
        reservation: reservationResult[0],
        availability_block: blockResult[0],
      });
    } catch (error) {
      if (
        error.message?.includes('availability_blocks_no_overlap') ||
        error.message?.includes('conflicting key value')
      ) {
        return response.status(409).json({
          ok: false,
          error: 'Those dates are no longer available',
        });
      }

      throw error;
    }
  } catch (error) {
    return response.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
