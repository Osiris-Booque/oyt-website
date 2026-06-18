/*
  # Add Calendar and Booking Features for Member Dashboard

  1. New Tables
    - `calendar_events` - For non-program events like workshops
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_date` (date)
      - `event_time` (time)
      - `event_type` (enum: class, workshop, event, other)
      - `location_url` (text, nullable)
      - `max_capacity` (int, nullable)
      - `created_by` (uuid, fk to profiles)
      - `created_at`, `updated_at` (timestamptz)

    - `instructor_bookings` - For 1:1 instructor sessions
      - `id` (uuid, primary key)
      - `instructor_id` (uuid, fk to profiles)
      - `user_id` (uuid, fk to profiles)
      - `booking_date` (date)
      - `booking_time` (time)
      - `duration_minutes` (int, default 60)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `notes` (text, nullable)
      - `rate` (numeric, nullable) - fee for booking in dollars
      - `created_at`, `updated_at` (timestamptz)

  2. Column Updates
    - `enrollments` table:
      - Add `eligible_until` (date, nullable) - when user access expires
      - Add `visible_on_calendar` (boolean, default true)

  3. Security
    - Enable RLS on all new tables
    - Add policies for user access control:
      - calendar_events: Public read, admins can create/update
      - instructor_bookings: Users see their own, instructors see theirs, admins see all
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time,
  event_type text NOT NULL CHECK (event_type IN ('class', 'workshop', 'event', 'other')),
  location_url text,
  max_capacity int,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can create calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Only admins can update calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Only admins can delete calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE TABLE IF NOT EXISTS instructor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  duration_minutes int DEFAULT 60,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  rate numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON instructor_bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Instructors can view their bookings"
  ON instructor_bookings FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Admins can view all bookings"
  ON instructor_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Users can create bookings"
  ON instructor_bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON instructor_bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Instructors can update bookings for their time"
  ON instructor_bookings FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Admins can update all bookings"
  ON instructor_bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'eligible_until'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN eligible_until date;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'visible_on_calendar'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN visible_on_calendar boolean DEFAULT true;
  END IF;
END $$;
