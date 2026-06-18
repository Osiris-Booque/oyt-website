/*
  # Calendar, booking, availability, and Stripe schema
  
  1. New Tables
    - calendar_events: Admin-managed events and workshops
    - instructor_bookings: 1:1 session bookings
    - instructor_availability: Weekly recurring availability
    - instructor_calendar_sync: External calendar OAuth tokens
    - instructor_unavailable_slots: Blocked time slots
    - stripe_customers, stripe_subscriptions, stripe_orders: Stripe integration
  
  2. Column additions
    - enrollments: eligible_until, visible_on_calendar
    - instructor_bookings: payment_id, zoom_link, confirmed_at
    - program_milestones: duration_minutes
    - daily_homework_tasks: activity_date
*/

-- ─── calendar_events ─────────────────────────────────────────────────────────
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

CREATE POLICY "Anyone can view calendar events" ON calendar_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create calendar events" ON calendar_events FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)));
CREATE POLICY "Only admins can update calendar events" ON calendar_events FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)));
CREATE POLICY "Only admins can delete calendar events" ON calendar_events FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)));

-- ─── instructor_bookings ──────────────────────────────────────────────────────
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

CREATE POLICY "Users can view their own bookings" ON instructor_bookings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Instructors can view their bookings" ON instructor_bookings FOR SELECT TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON instructor_bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)));
CREATE POLICY "Users can create bookings" ON instructor_bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON instructor_bookings FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Instructors can update bookings for their time" ON instructor_bookings FOR UPDATE TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "Admins can update all bookings" ON instructor_bookings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)));

-- ─── enrollments column additions ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'eligible_until') THEN
    ALTER TABLE enrollments ADD COLUMN eligible_until date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'visible_on_calendar') THEN
    ALTER TABLE enrollments ADD COLUMN visible_on_calendar boolean DEFAULT true;
  END IF;
END $$;

-- ─── instructor_availability ──────────────────────────────────────────────────
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

CREATE POLICY "Instructors can view their own availability" ON instructor_availability FOR SELECT TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "Instructors can create their own availability" ON instructor_availability FOR INSERT TO authenticated WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can update their own availability" ON instructor_availability FOR UPDATE TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can delete their own availability" ON instructor_availability FOR DELETE TO authenticated USING (instructor_id = auth.uid());

-- ─── instructor_calendar_sync ─────────────────────────────────────────────────
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

CREATE POLICY "Instructors can view their own sync settings" ON instructor_calendar_sync FOR SELECT TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "Instructors can create their own sync" ON instructor_calendar_sync FOR INSERT TO authenticated WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can update their own sync" ON instructor_calendar_sync FOR UPDATE TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can delete their own sync" ON instructor_calendar_sync FOR DELETE TO authenticated USING (instructor_id = auth.uid());

-- ─── instructor_unavailable_slots ─────────────────────────────────────────────
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

CREATE POLICY "Instructors can view their blocked slots" ON instructor_unavailable_slots FOR SELECT TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "Instructors can create blocked slots" ON instructor_unavailable_slots FOR INSERT TO authenticated WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can update blocked slots" ON instructor_unavailable_slots FOR UPDATE TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can delete blocked slots" ON instructor_unavailable_slots FOR DELETE TO authenticated USING (instructor_id = auth.uid());

-- ─── instructor_bookings column additions ─────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'instructor_bookings' AND column_name = 'payment_id') THEN
    ALTER TABLE instructor_bookings ADD COLUMN payment_id uuid REFERENCES payments(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'instructor_bookings' AND column_name = 'zoom_link') THEN
    ALTER TABLE instructor_bookings ADD COLUMN zoom_link text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'instructor_bookings' AND column_name = 'confirmed_at') THEN
    ALTER TABLE instructor_bookings ADD COLUMN confirmed_at timestamptz;
  END IF;
END $$;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_instructor_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_day ON instructor_availability(instructor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_unavailable_slots_instructor ON instructor_unavailable_slots(instructor_id);
CREATE INDEX IF NOT EXISTS idx_unavailable_slots_time ON instructor_unavailable_slots(instructor_id, blocked_start, blocked_end);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_instructor ON instructor_calendar_sync(instructor_id);

-- ─── duration_minutes on milestones, activity_date on tasks ──────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_milestones' AND column_name = 'duration_minutes') THEN
    ALTER TABLE program_milestones ADD COLUMN duration_minutes INTEGER DEFAULT 60;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_homework_tasks' AND column_name = 'activity_date') THEN
    ALTER TABLE daily_homework_tasks ADD COLUMN activity_date DATE;
  END IF;
END $$;

-- ─── Stripe tables ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data" ON stripe_customers FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_subscription_status') THEN
    CREATE TYPE stripe_subscription_status AS ENUM (
      'not_started','incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data" ON stripe_subscriptions FOR SELECT TO authenticated
  USING (
    customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid() AND deleted_at IS NULL)
    AND deleted_at IS NULL
  );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
    CREATE TYPE stripe_order_status AS ENUM ('pending', 'completed', 'canceled');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint primary key generated always as identity,
  checkout_session_id text not null,
  payment_intent_id text not null,
  customer_id text not null,
  amount_subtotal bigint not null,
  amount_total bigint not null,
  currency text not null,
  payment_status text not null,
  status stripe_order_status not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data" ON stripe_orders FOR SELECT TO authenticated
  USING (
    customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid() AND deleted_at IS NULL)
    AND deleted_at IS NULL
  );

DROP VIEW IF EXISTS stripe_user_subscriptions;
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT c.customer_id, s.subscription_id, s.status as subscription_status, s.price_id,
  s.current_period_start, s.current_period_end, s.cancel_at_period_end, s.payment_method_brand, s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid() AND c.deleted_at IS NULL AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

DROP VIEW IF EXISTS stripe_user_orders;
CREATE VIEW stripe_user_orders WITH (security_invoker = true) AS
SELECT c.customer_id, o.id as order_id, o.checkout_session_id, o.payment_intent_id,
  o.amount_subtotal, o.amount_total, o.currency, o.payment_status, o.status as order_status, o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid() AND c.deleted_at IS NULL AND o.deleted_at IS NULL;

GRANT SELECT ON stripe_user_orders TO authenticated;
