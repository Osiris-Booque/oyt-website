/*
  # Add instructor_id to programs

  1. Changes
    - Add `instructor_id` column to `programs` table referencing `profiles(id)`
    - Backfill `instructor_id` from `admin_id` for existing programs
    - Add index for instructor lookups
    - Add RLS policy for instructors to read programs assigned to them

  2. Notes
    - instructor_id identifies who teaches/delivers the program
    - admin_id remains as the creator/owner field
    - Instructors can view their assigned programs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE programs ADD COLUMN instructor_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

UPDATE programs SET instructor_id = admin_id WHERE instructor_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_programs_instructor ON programs(instructor_id);

CREATE POLICY "Instructors can read their assigned programs"
  ON programs FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their assigned programs"
  ON programs FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());
