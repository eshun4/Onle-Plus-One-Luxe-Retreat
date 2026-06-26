import { authClient } from '../auth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function getAdminJwtToken() {
  const sessionResult = await authClient.getSession();

  const sessionToken =
    sessionResult.data?.session?.access_token ||
    sessionResult.data?.session?.token;

  if (sessionToken) {
    return sessionToken;
  }

  const tokenResult = await authClient.token().catch((error) => ({
    error,
    data: null,
  }));

  const token =
    tokenResult.data?.token ||
    tokenResult.data?.session?.access_token ||
    tokenResult.data?.session?.token;

  if (token) {
    return token;
  }

  throw new Error(
    tokenResult.error?.message ||
      sessionResult.error?.message ||
      'Could not get admin token. Please sign out and sign in again.'
  );
}

async function requestJson(path, options = {}) {
  const token = await getAdminJwtToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export async function getAdminReservations() {
  return requestJson('/api/admin/reservations');
}

export async function getChannelConnections() {
  return requestJson('/api/admin/channel-connections');
}

export async function syncChannel(channelName) {
  return requestJson('/api/admin/sync-channel', {
    method: 'POST',
    body: JSON.stringify({
      channel_name: channelName,
    }),
  });
}

export async function getManualBlocks() {
  return requestJson('/api/admin/manual-blocks');
}

export async function createManualBlock({ startDate, endDate, reason }) {
  return requestJson('/api/admin/manual-blocks', {
    method: 'POST',
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      reason,
    }),
  });
}

export async function cancelManualBlock(id) {
  return requestJson(`/api/admin/manual-blocks?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
