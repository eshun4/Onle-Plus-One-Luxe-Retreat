import { createHash, randomUUID } from 'node:crypto';
import { sql } from './db.js';
import { parseIcalEvents } from './icalParser.js';

const VALID_IMPORT_CHANNELS = new Set(['booking_com', 'airbnb', 'vrbo']);

function createStableEventUid(channelName, event) {
  if (event.uid) {
    return event.uid;
  }

  return createHash('sha256')
    .update(
      JSON.stringify({
        channelName,
        check_in: event.check_in,
        check_out: event.check_out,
        summary: event.summary,
      }),
    )
    .digest('hex');
}

function createGuestName(channelName) {
  if (channelName === 'booking_com') return 'Booking.com guest';
  if (channelName === 'airbnb') return 'Airbnb guest';
  if (channelName === 'vrbo') return 'Vrbo guest';
  return 'External calendar guest';
}

async function fetchIcalText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/calendar, text/plain, */*',
      'User-Agent': 'OnePlusOneLuxeRetreatCalendarSync/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch iCal feed: HTTP ${response.status}`);
  }

  return response.text();
}

export async function syncIcalChannel({ channelName }) {
  if (!VALID_IMPORT_CHANNELS.has(channelName)) {
    throw new Error(
      'Invalid channelName. Use one of: booking_com, airbnb, vrbo',
    );
  }

  const connections = await sql`
    SELECT
      cc.id,
      cc.property_id,
      cc.channel_name,
      cc.ical_import_url,
      p.name AS property_name
    FROM channel_connections cc
    JOIN properties p
      ON p.id = cc.property_id
    WHERE cc.channel_name = ${channelName}
      AND cc.is_active = TRUE
      AND p.is_active = TRUE
    LIMIT 1
  `;

  const connection = connections[0];

  if (!connection) {
    throw new Error(`No active channel connection found for ${channelName}`);
  }

  if (!connection.ical_import_url) {
    throw new Error(`No iCal import URL saved for ${channelName}`);
  }

  const syncRunRows = await sql`
    INSERT INTO sync_runs (
      channel_connection_id,
      status
    )
    VALUES (
      ${connection.id},
      'running'
    )
    RETURNING id
  `;

  const syncRun = syncRunRows[0];

  let eventsFound = 0;
  let eventsCreated = 0;
  let eventsUpdated = 0;
  let eventsCancelled = 0;

  try {
    const icsText = await fetchIcalText(connection.ical_import_url);
    const events = parseIcalEvents(icsText);

    eventsFound = events.length;

    for (const event of events) {
      const sourceEventUid = createStableEventUid(channelName, event);
      const isCancelled = event.status === 'CANCELLED';

      const existingReservations = await sql`
        SELECT
          id,
          status
        FROM reservations
        WHERE property_id = ${connection.property_id}
          AND source = ${channelName}
          AND source_event_uid = ${sourceEventUid}
        LIMIT 1
      `;

      const existingReservation = existingReservations[0];

      if (existingReservation && isCancelled) {
        await sql.transaction([
          sql`
            UPDATE reservations
            SET
              status = 'cancelled',
              check_in = ${event.check_in},
              check_out = ${event.check_out},
              raw_payload = ${JSON.stringify(event)}
            WHERE id = ${existingReservation.id}
          `,
          sql`
            UPDATE availability_blocks
            SET
              status = 'cancelled',
              start_date = ${event.check_in},
              end_date = ${event.check_out},
              reason = ${`${channelName} calendar event cancelled`}
            WHERE reservation_id = ${existingReservation.id}
          `,
        ]);

        eventsCancelled += 1;
        continue;
      }

      if (existingReservation) {
        await sql.transaction([
          sql`
            UPDATE reservations
            SET
              status = 'confirmed',
              check_in = ${event.check_in},
              check_out = ${event.check_out},
              guest_name = ${createGuestName(channelName)},
              raw_payload = ${JSON.stringify(event)}
            WHERE id = ${existingReservation.id}
          `,
          sql`
            UPDATE availability_blocks
            SET
              status = 'active',
              start_date = ${event.check_in},
              end_date = ${event.check_out},
              reason = ${`${channelName} imported calendar block`},
              external_uid = ${sourceEventUid}
            WHERE reservation_id = ${existingReservation.id}
          `,
        ]);

        eventsUpdated += 1;
        continue;
      }

      if (isCancelled) {
        continue;
      }

      const reservationId = randomUUID();
      const blockId = randomUUID();

      await sql.transaction([
        sql`
          INSERT INTO reservations (
            id,
            property_id,
            source,
            source_reservation_id,
            source_event_uid,
            guest_name,
            guest_count,
            check_in,
            check_out,
            status,
            currency,
            notes,
            raw_payload
          )
          VALUES (
            ${reservationId},
            ${connection.property_id},
            ${channelName},
            ${sourceEventUid},
            ${sourceEventUid},
            ${createGuestName(channelName)},
            1,
            ${event.check_in},
            ${event.check_out},
            'confirmed',
            'USD',
            ${event.summary || `${channelName} imported calendar event`},
            ${JSON.stringify(event)}
          )
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
            ${connection.property_id},
            ${reservationId},
            ${channelName},
            ${event.check_in},
            ${event.check_out},
            'active',
            ${`${channelName} imported calendar block`},
            ${sourceEventUid}
          )
        `,
      ]);

      eventsCreated += 1;
    }

    await sql`
      UPDATE sync_runs
      SET
        finished_at = now(),
        status = 'success',
        events_found = ${eventsFound},
        events_created = ${eventsCreated},
        events_updated = ${eventsUpdated},
        events_cancelled = ${eventsCancelled}
      WHERE id = ${syncRun.id}
    `;

    await sql`
      UPDATE channel_connections
      SET
        last_synced_at = now(),
        last_sync_status = 'success',
        last_sync_error = NULL
      WHERE id = ${connection.id}
    `;

    return {
      ok: true,
      channel_name: channelName,
      sync_run_id: syncRun.id,
      events_found: eventsFound,
      events_created: eventsCreated,
      events_updated: eventsUpdated,
      events_cancelled: eventsCancelled,
    };
  } catch (error) {
    await sql`
      UPDATE sync_runs
      SET
        finished_at = now(),
        status = 'failed',
        events_found = ${eventsFound},
        events_created = ${eventsCreated},
        events_updated = ${eventsUpdated},
        events_cancelled = ${eventsCancelled},
        error_message = ${error.message}
      WHERE id = ${syncRun.id}
    `;

    await sql`
      UPDATE channel_connections
      SET
        last_synced_at = now(),
        last_sync_status = 'failed',
        last_sync_error = ${error.message}
      WHERE id = ${connection.id}
    `;

    throw error;
  }
}
