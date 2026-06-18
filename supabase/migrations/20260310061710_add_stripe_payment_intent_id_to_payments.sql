/*
  # Add stripe_payment_intent_id to payments table

  ## Summary
  The stripe-checkout edge function records the Stripe PaymentIntent ID after a
  successful charge, but the payments table was missing this column. Without it,
  every successful payment would succeed in Stripe but fail to persist in the
  database (500 error returned to the user, no enrollment created).

  ## Changes
  - `payments` table: add `stripe_payment_intent_id` (text, nullable) to store
    the Stripe PaymentIntent ID returned after a confirmed charge.

  ## Notes
  - Column is nullable so existing rows are unaffected.
  - A unique index is added to prevent duplicate intent IDs from being recorded.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN stripe_payment_intent_id text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_intent
  ON payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
