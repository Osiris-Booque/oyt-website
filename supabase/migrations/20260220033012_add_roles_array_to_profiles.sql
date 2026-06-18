/*
  # Add roles array to profiles

  ## Summary
  Adds a `roles` text array column to profiles to support multiple roles per user.
  The existing single `role` column remains as the primary/highest role for backward
  compatibility with all existing RLS policies and routing logic.

  ## Changes
  1. Modified Tables
    - `profiles` - adds `roles text[]` column, backfills from existing `role` value

  ## Notes
  - The `role` column continues to drive RLS policies and portal routing
  - The `roles` array is used in the admin UI to display/edit all assigned roles
  - On save, the `role` column is updated to the highest-privilege role in `roles`
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'roles'
  ) THEN
    ALTER TABLE profiles ADD COLUMN roles text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

UPDATE profiles SET roles = ARRAY[role] WHERE roles = '{}' OR roles IS NULL;
