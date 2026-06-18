/*
  # Add Stripe Payment Link URL to Programs Table

  1. Purpose
    - Add unique Stripe payment link URL for each program
    - Enables flexible payment routing for different offerings
    - Supports multiple SKUs with different pricing and payment flows

  2. Changes
    - Add `stripe_payment_link_url` column to `programs` table
    - Nullable to support programs that don't have payments enabled yet

  3. Notes
    - Each program can have its own unique Stripe payment link
    - Payment links can be managed through Stripe dashboard
    - Allows for different pricing, discounts, and product bundles per program
*/

ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS stripe_payment_link_url text;
