-- One Plus One Luxe Retreat
-- Database foundation for booking consolidation system

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  public_location TEXT,
  timezone TEXT NOT NULL DEFAULT 'Africa/Accra',
  currency TEXT NOT NULL DEFAULT 'USD',
  base_nightly_rate_cents INTEGER NOT NULL DEFAULT 0,
  cleaning_fee_cents INTEGER NOT NULL DEFAULT 0,
  max_guests INTEGER NOT NULL DEFAULT 1,
  check_in_time TIME,
  check_out_time TIME,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS channel_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  ical_import_url TEXT,
  ical_export_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT channel_connections_channel_name_check
    CHECK (channel_name IN ('booking_com', 'airbnb', 'vrbo', 'direct')),

  CONSTRAINT channel_connections_unique_property_channel
    UNIQUE (property_id, channel_name)
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  source TEXT NOT NULL,
  source_reservation_id TEXT,
  source_event_uid TEXT,

  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  guest_count INTEGER NOT NULL DEFAULT 1,

  check_in DATE NOT NULL,
  check_out DATE NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',
  total_price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',

  notes TEXT,
  raw_payload JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT reservations_source_check
    CHECK (source IN ('booking_com', 'airbnb', 'vrbo', 'direct', 'manual')),

  CONSTRAINT reservations_status_check
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'hold')),

  CONSTRAINT reservations_valid_date_range
    CHECK (check_out > check_in),

  CONSTRAINT reservations_guest_count_check
    CHECK (guest_count > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS reservations_unique_source_reservation
ON reservations (property_id, source, source_reservation_id)
WHERE source_reservation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reservations_unique_source_event
ON reservations (property_id, source, source_event_uid)
WHERE source_event_uid IS NOT NULL;

CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,

  source TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  status TEXT NOT NULL DEFAULT 'active',
  reason TEXT,
  external_uid TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT availability_blocks_source_check
    CHECK (source IN ('booking_com', 'airbnb', 'vrbo', 'direct', 'manual')),

  CONSTRAINT availability_blocks_status_check
    CHECK (status IN ('active', 'cancelled')),

  CONSTRAINT availability_blocks_valid_date_range
    CHECK (end_date > start_date)
);

ALTER TABLE availability_blocks
DROP CONSTRAINT IF EXISTS availability_blocks_no_overlap;

ALTER TABLE availability_blocks
ADD CONSTRAINT availability_blocks_no_overlap
EXCLUDE USING gist (
  property_id WITH =,
  daterange(start_date, end_date, '[)') WITH &&
)
WHERE (status = 'active');

CREATE TABLE IF NOT EXISTS sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_connection_id UUID NOT NULL REFERENCES channel_connections(id) ON DELETE CASCADE,

  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,

  status TEXT NOT NULL DEFAULT 'running',
  events_found INTEGER NOT NULL DEFAULT 0,
  events_created INTEGER NOT NULL DEFAULT 0,
  events_updated INTEGER NOT NULL DEFAULT 0,
  events_cancelled INTEGER NOT NULL DEFAULT 0,

  error_message TEXT,

  CONSTRAINT sync_runs_status_check
    CHECK (status IN ('running', 'success', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_properties_slug
ON properties (slug);

CREATE INDEX IF NOT EXISTS idx_channel_connections_property_id
ON channel_connections (property_id);

CREATE INDEX IF NOT EXISTS idx_channel_connections_channel_name
ON channel_connections (channel_name);

CREATE INDEX IF NOT EXISTS idx_reservations_property_dates
ON reservations (property_id, check_in, check_out);

CREATE INDEX IF NOT EXISTS idx_reservations_source
ON reservations (source);

CREATE INDEX IF NOT EXISTS idx_reservations_status
ON reservations (status);

CREATE INDEX IF NOT EXISTS idx_availability_blocks_property_dates
ON availability_blocks (property_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_availability_blocks_status
ON availability_blocks (status);

CREATE INDEX IF NOT EXISTS idx_sync_runs_channel_connection_id
ON sync_runs (channel_connection_id);

CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at
ON sync_runs (started_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_properties_updated_at ON properties;
CREATE TRIGGER set_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_channel_connections_updated_at ON channel_connections;
CREATE TRIGGER set_channel_connections_updated_at
BEFORE UPDATE ON channel_connections
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_reservations_updated_at ON reservations;
CREATE TRIGGER set_reservations_updated_at
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_availability_blocks_updated_at ON availability_blocks;
CREATE TRIGGER set_availability_blocks_updated_at
BEFORE UPDATE ON availability_blocks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
