/*
  # Add first_name and last_name columns to profiles

  ## Summary
  Adds first_name and last_name columns to the profiles table alongside the existing
  full_name column for backward compatibility. Backfills first_name/last_name by
  splitting existing full_name values on the first space.

  ## Changes
  - profiles: add first_name (text, default ''), last_name (text, default '')
  - Backfill from existing full_name data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN first_name text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_name text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Backfill first_name / last_name from full_name
UPDATE profiles
SET
  first_name = TRIM(split_part(full_name, ' ', 1)),
  last_name  = TRIM(substring(full_name FROM position(' ' IN full_name) + 1))
WHERE first_name = '' AND full_name <> '';
