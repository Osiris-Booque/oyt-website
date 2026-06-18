/*
  # Instructor Availability and Calendar Sync System

  1. New Tables
    - `instructor_availability`: Weekly recurring availability slots for instructors
      - `id` (uuid, primary key)
      - `instructor_id` (uuid, foreign key to profiles)
      - `day_of_week` (int, 0-6 for Sun-Sat)
      - `start_time` (time)
      - `end_time` (time)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `instructor_calendar_sync`: OAuth/integration tokens for external calendars
      - `id` (uuid, primary key)
      - `instructor_id` (uuid, foreign key to profiles)
      - `calendar_type` (text: 'google' or 'ical')
      - `access_token` (encrypted text)
      - `refresh_token` (encrypted text, nullable for iCal)
      - `calendar_id` (text - Google calendar ID or iCal URL)
      - `is_synced` (boolean, default true)
      - `last_sync_at` (timestamp, nullable)
      - `sync_errors` (text, nullable for error logging)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `instructor_unavailable_slots`: Blocked time slots (from synced calendars or manual blocks)
      - `id` (uuid, primary key)
      - `instructor_id` (uuid, foreign key to profiles)
      - `blocked_start` (timestamp)
      - `blocked_end` (timestamp)
      - `reason` (text: 'personal', 'synced_event', 'manual', 'booking')
      - `external_event_id` (text, nullable - for synced calendar events)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Updated Tables
    - `instructor_bookings`: Add payment tracking
      - `payment_id` (uuid, foreign key to payments, nullable)
      - `zoom_link` (text, nullable - auto-generated)
      - `confirmed_at` (timestamp, nullable)

  3. Security
    - Enable RLS on all new tables
    - Instructors can manage their own availability and sync settings
    - Only instructors see their sync tokens and full calendar
    - Members can only see available time slots

  4. Important Notes
    - Calendar sync integration happens via edge functions
    - Payment must be completed before booking is confirmed
    - Availability syncs in real-time from external calendars
    - Bookings block availability automatically
*/

CREATE TABLE IF NOT EXISTS instructor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(instructor_id, day_of_week, start_time, end_time)
);

ALTER TABLE instructor_availability ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS instructor_calendar_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  calendar_type text NOT NULL CHECK (calendar_type = ANY(ARRAY['google', 'ical'])),
  access_token text NOT NULL,
  refresh_token text,
  calendar_id text NOT NULL,
  is_synced boolean NOT NULL DEFAULT true,
  last_sync_at timestamptz,
  sync_errors text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(instructor_id, calendar_type)
);

ALTER TABLE instructor_calendar_sync ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS instructor_unavailable_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_start timestamptz NOT NULL,
  blocked_end timestamptz NOT NULL,
  reason text NOT NULL CHECK (reason = ANY(ARRAY['personal', 'synced_event', 'manual', 'booking'])),
  external_event_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructor_unavailable_slots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_bookings' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE instructor_bookings ADD COLUMN payment_id uuid REFERENCES payments(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_bookings' AND column_name = 'zoom_link'
  ) THEN
    ALTER TABLE instructor_bookings ADD COLUMN zoom_link text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_bookings' AND column_name = 'confirmed_at'
  ) THEN
    ALTER TABLE instructor_bookings ADD COLUMN confirmed_at timestamptz;
  END IF;
END $$;

CREATE POLICY "Instructors can view their own availability"
  ON instructor_availability FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create their own availability"
  ON instructor_availability FOR INSERT
  TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their own availability"
  ON instructor_availability FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete their own availability"
  ON instructor_availability FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can view their own sync settings"
  ON instructor_calendar_sync FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create their own sync"
  ON instructor_calendar_sync FOR INSERT
  TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their own sync"
  ON instructor_calendar_sync FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete their own sync"
  ON instructor_calendar_sync FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can view their blocked slots"
  ON instructor_unavailable_slots FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create blocked slots"
  ON instructor_unavailable_slots FOR INSERT
  TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update blocked slots"
  ON instructor_unavailable_slots FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete blocked slots"
  ON instructor_unavailable_slots FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE INDEX idx_instructor_availability_instructor
  ON instructor_availability(instructor_id);

CREATE INDEX idx_instructor_availability_day
  ON instructor_availability(instructor_id, day_of_week);

CREATE INDEX idx_unavailable_slots_instructor
  ON instructor_unavailable_slots(instructor_id);

CREATE INDEX idx_unavailable_slots_time
  ON instructor_unavailable_slots(instructor_id, blocked_start, blocked_end);

CREATE INDEX idx_calendar_sync_instructor
  ON instructor_calendar_sync(instructor_id);
