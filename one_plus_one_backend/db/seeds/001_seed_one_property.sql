BEGIN;

INSERT INTO properties (
  id,
  name,
  slug,
  public_location,
  timezone,
  currency,
  base_nightly_rate_cents,
  cleaning_fee_cents,
  max_guests,
  check_in_time,
  check_out_time,
  is_active
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'One Plus One Luxe Retreat',
  'one-plus-one-luxe-retreat',
  'Sakumono / Tema, Accra, Ghana',
  'Africa/Accra',
  'USD',
  7000,
  0,
  3,
  '15:00',
  '11:00',
  TRUE
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  public_location = EXCLUDED.public_location,
  timezone = EXCLUDED.timezone,
  currency = EXCLUDED.currency,
  base_nightly_rate_cents = EXCLUDED.base_nightly_rate_cents,
  cleaning_fee_cents = EXCLUDED.cleaning_fee_cents,
  max_guests = EXCLUDED.max_guests,
  check_in_time = EXCLUDED.check_in_time,
  check_out_time = EXCLUDED.check_out_time,
  is_active = EXCLUDED.is_active;

INSERT INTO channel_connections (
  property_id,
  channel_name,
  ical_import_url,
  is_active
)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'booking_com', NULL, TRUE),
  ('11111111-1111-1111-1111-111111111111', 'airbnb', NULL, TRUE),
  ('11111111-1111-1111-1111-111111111111', 'vrbo', NULL, TRUE),
  ('11111111-1111-1111-1111-111111111111', 'direct', NULL, TRUE)
ON CONFLICT (property_id, channel_name) DO NOTHING;

COMMIT;
