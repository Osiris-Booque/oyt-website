/*
  # Payments table and related enrollment restriction

  ## New Tables
  - `payments`: Tracks payment intent and outcome for program enrollments

  ## Changes
  - Adds payments table with full RLS
  - Restricts enrollment self-insert to require a paid payment row
  - Adds stripe_payment_intent_id column to payments
  - Adds stripe_payment_link_url column to programs
  - Aligns required_role constraint to three-role system
*/

-- ─── Payments table ───────────────────────────────────────────────────────────
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

CREATE POLICY "Users can view own payments" ON payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND 'admin' = ANY(profiles.roles)));

CREATE POLICY "Admins can update all payments" ON payments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND 'admin' = ANY(profiles.roles)))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND 'admin' = ANY(profiles.roles)));

CREATE POLICY "Instructors can view payments for their programs" ON payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = payments.program_id AND programs.instructor_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_program ON payments(program_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ─── Restrict enrollment insert to paid payments ──────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Users can insert own enrollments') THEN
    DROP POLICY "Users can insert own enrollments" ON enrollments;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Users can self-enroll only after confirmed payment') THEN
    CREATE POLICY "Users can self-enroll only after confirmed payment" ON enrollments FOR INSERT TO authenticated
      WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM payments
          WHERE payments.user_id = auth.uid()
          AND payments.program_id = enrollments.program_id
          AND payments.status = 'paid'
        )
      );
  END IF;
END $$;

-- ─── stripe_payment_intent_id column ──────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_payment_intent_id') THEN
    ALTER TABLE payments ADD COLUMN stripe_payment_intent_id text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_intent
  ON payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- ─── stripe_payment_link_url on programs ──────────────────────────────────────
ALTER TABLE programs ADD COLUMN IF NOT EXISTS stripe_payment_link_url text;

-- ─── Align required_role constraint ───────────────────────────────────────────
UPDATE programs SET required_role = 'member' WHERE required_role NOT IN ('member', 'instructor', 'admin');
ALTER TABLE programs DROP CONSTRAINT IF EXISTS courses_required_role_check;
ALTER TABLE programs ADD CONSTRAINT programs_required_role_check
  CHECK (required_role = ANY (ARRAY['member'::text, 'instructor'::text, 'admin'::text]));
