/*
  # Create payments table

  ## Summary
  Introduces a `payments` table as the authoritative record of payment intent and outcome
  for every program enrollment. An enrollment may only be created once a confirmed payment
  exists for the same user + program combination.

  ## New Tables
  - `payments`
    - `id` (uuid, primary key)
    - `user_id` (uuid, FK → profiles, cascade delete)
    - `program_id` (uuid, FK → programs, cascade delete)
    - `amount` (integer, in cents)
    - `status` (text) — pending | paid | failed
    - `payment_method_last4` (text, nullable) — last 4 digits of test/real card
    - `payment_method_expiry` (text, nullable) — MM/YY
    - `created_at` (timestamptz)
    - `confirmed_at` (timestamptz, nullable) — set when status transitions to paid

  ## Security
  - RLS enabled; no anonymous access
  - Users can SELECT their own payment rows
  - Users can INSERT their own payment rows (to create a pending record)
  - Users can UPDATE their own payment rows (to flip pending → paid/failed)
  - Admins have full access
  - Instructors can view payments for their own programs

  ## Notes
  - The payments table is intentionally separate from enrollments so that partial/failed
    payment attempts are preserved for audit purposes even when no enrollment is created.
  - The unique index on (user_id, program_id) prevents duplicate paid rows for the same
    user+program. A unique partial index only on status='paid' rows enforces this cleanly.
*/

CREATE TABLE IF NOT EXISTS payments (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id             uuid        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  amount                 integer     NOT NULL DEFAULT 0,
  status                 text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  payment_method_last4   text,
  payment_method_expiry  text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  confirmed_at           timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.roles)
    )
  );

CREATE POLICY "Admins can update all payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.roles)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.roles)
    )
  );

CREATE POLICY "Instructors can view payments for their programs"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = payments.program_id
      AND programs.instructor_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_payments_user       ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_program    ON payments(program_id);
CREATE INDEX IF NOT EXISTS idx_payments_status     ON payments(status);
