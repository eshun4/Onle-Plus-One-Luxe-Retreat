import { sql } from '../../lib/db.js';
import { syncIcalChannel } from '../../lib/syncIcalChannel.js';

const CHANNELS_TO_SYNC = ['booking_com', 'airbnb', 'vrbo'];

function isAuthorizedCronRequest(request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  return request.headers.authorization === `Bearer ${cronSecret}`;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({
      ok: false,
      error: 'Method not allowed',
    });
  }

  if (!isAuthorizedCronRequest(request)) {
    return response.status(401).json({
      ok: false,
      error: 'Unauthorized',
    });
  }

  const startedAt = new Date().toISOString();
  const results = [];

  const connections = await sql`
    SELECT
      channel_name,
      ical_import_url,
      is_active
    FROM channel_connections
    WHERE channel_name = ANY(${CHANNELS_TO_SYNC})
    ORDER BY channel_name ASC
  `;

  for (const channelName of CHANNELS_TO_SYNC) {
    const connection = connections.find(
      (item) => item.channel_name === channelName,
    );

    if (!connection || !connection.is_active) {
      results.push({
        channel_name: channelName,
        ok: true,
        status: 'skipped',
        reason: 'Channel is not active',
      });
      continue;
    }

    if (!connection.ical_import_url) {
      results.push({
        channel_name: channelName,
        ok: true,
        status: 'skipped',
        reason: 'No iCal import URL saved yet',
      });
      continue;
    }

    try {
      const result = await syncIcalChannel({
        channelName,
      });

      results.push({
        channel_name: channelName,
        ok: true,
        status: 'synced',
        ...result,
      });
    } catch (error) {
      results.push({
        channel_name: channelName,
        ok: false,
        status: 'failed',
        error: error.message,
      });
    }
  }

  const failedCount = results.filter((result) => !result.ok).length;

  return response.status(failedCount ? 207 : 200).json({
    ok: failedCount === 0,
    message: failedCount
      ? 'Cron sync completed with some channel errors'
      : 'Cron sync completed successfully',
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    failed_count: failedCount,
    results,
  });
}
