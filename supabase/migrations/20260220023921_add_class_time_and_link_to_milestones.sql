/*
  # Add class_time and class_link to program_milestones

  ## Summary
  Adds two optional columns to the program_milestones table to support
  displaying upcoming class details on the student dashboard.

  ## Changes
  - `program_milestones`
    - `class_time` (time): The scheduled time for the class (e.g. 10:00:00)
    - `class_link` (text): A URL to join the class (e.g. Zoom, Google Meet)

  ## Notes
  - Both columns are nullable; existing rows are unaffected
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_milestones' AND column_name = 'class_time'
  ) THEN
    ALTER TABLE program_milestones ADD COLUMN class_time time;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_milestones' AND column_name = 'class_link'
  ) THEN
    ALTER TABLE program_milestones ADD COLUMN class_link text;
  END IF;
END $$;
