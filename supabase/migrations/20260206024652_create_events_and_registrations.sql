/*
  # Create live_events and event_registrations tables

  1. New Tables
    - `live_events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_type` (text) - workshop, class, webinar
      - `provider_id` (uuid, FK to profiles)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `meeting_url` (text, nullable)
      - `max_attendees` (integer, nullable)
      - `cover_image_url` (text, nullable)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz)

    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, FK to live_events)
      - `user_id` (uuid, FK to profiles)
      - `registered_at` (timestamptz)
      - `status` (text) - registered, attended, cancelled
      - Unique constraint on (event_id, user_id)

  2. Security
    - RLS on both tables
    - Students can read published events and manage own registrations
    - Providers can CRUD their own events and read registrations
    - Admins have full access
*/

CREATE TABLE IF NOT EXISTS live_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_type text NOT NULL DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'class', 'webinar')),
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  meeting_url text,
  max_attendees integer,
  cover_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read published events"
  ON live_events FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Providers can read own events"
  ON live_events FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own events"
  ON live_events FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('provider', 'admin'))
  );

CREATE POLICY "Providers can update own events"
  ON live_events FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can delete own events"
  ON live_events FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all events"
  ON live_events FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES live_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  UNIQUE (event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own registrations"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers can read registrations for their events"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM live_events WHERE live_events.id = event_id AND live_events.provider_id = auth.uid())
  );

CREATE POLICY "Providers can update registrations for their events"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM live_events WHERE live_events.id = event_id AND live_events.provider_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM live_events WHERE live_events.id = event_id AND live_events.provider_id = auth.uid())
  );

CREATE POLICY "Admins can manage all registrations"
  ON event_registrations FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_events_provider ON live_events(provider_id);
CREATE INDEX IF NOT EXISTS idx_events_start ON live_events(start_time);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
