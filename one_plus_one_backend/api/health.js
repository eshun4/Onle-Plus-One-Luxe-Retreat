import { sql } from '../lib/db.js';

export default async function handler(request, response) {
  try {
    const result = await sql`
      SELECT
        name,
        slug,
        public_location,
        max_guests,
        currency,
        base_nightly_rate_cents
      FROM properties
      LIMIT 1
    `;

    return response.status(200).json({
      ok: true,
      service: 'one-plus-one-backend',
      database: 'connected',
      property: result[0] ?? null,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      service: 'one-plus-one-backend',
      database: 'error',
      error: error.message,
    });
  }
}
