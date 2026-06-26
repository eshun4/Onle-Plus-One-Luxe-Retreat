const PROPERTY_SLUG = 'one-plus-one-luxe-retreat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function readJsonResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  if (!data) {
    throw new Error('The booking server returned an invalid response.');
  }

  return data;
}

export async function getAvailability({ start, end }) {
  const searchParams = new URLSearchParams({
    propertySlug: PROPERTY_SLUG,
    start,
    end,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/availability?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return readJsonResponse(response);
}

export async function createReservation({
  checkIn,
  checkout,
  guestCount,
  guestName,
  guestPhone,
  guestMessage,
}) {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      propertySlug: PROPERTY_SLUG,
      check_in: checkIn,
      check_out: checkout,
      guest_count: Number(guestCount),
      guest_name: guestName,
      guest_phone: guestPhone,
      notes: guestMessage,
    }),
  });

  return readJsonResponse(response);
}
